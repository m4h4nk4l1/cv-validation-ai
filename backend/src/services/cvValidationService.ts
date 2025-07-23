import { createOpenAIClient, validationPrompt } from '@/config/langchain';
import { VALIDATION_CONFIG, MismatchedField, ValidationResponse } from '@/types/shared';

export class CVValidationService {
  private openAIClient = createOpenAIClient();

  /**
   * Validate CV content against form data using AI
   */
  async validateCV(formData: {
    fullName: string;
    email: string;
    phone?: string;
    yearsExperience: number;
    skills?: string[];
  }, pdfText: string): Promise<ValidationResponse> {
    try {
      // Prepare the prompt with form data and PDF text
      const prompt = this.buildValidationPrompt(formData, pdfText);
      
      // Get AI response
      const response = await this.openAIClient.invoke(prompt);
      
      // Parse the AI response
      const validationResult = this.parseAIResponse(response.content as string);
      
      // Determine overall validation result
      const isValid = this.determineOverallValidation(validationResult);
      
      // Generate mismatched fields
      const mismatchedFields = this.generateMismatchedFields(formData, validationResult);
      
      return {
        isValid,
        mismatchedFields,
        confidenceScore: validationResult.overallConfidence,
        summary: validationResult.summary
      };
    } catch (error) {
      console.error('CV validation error:', error);
      throw new Error('Failed to validate CV');
    }
  }

  /**
   * Build the validation prompt for AI
   */
  private buildValidationPrompt(formData: any, pdfText: string): string {
    return validationPrompt
      .replace('{cvText}', pdfText)
      .replace('{fullName}', formData.fullName)
      .replace('{email}', formData.email)
      .replace('{phone}', formData.phone || 'Not provided')
      .replace('{yearsExperience}', formData.yearsExperience.toString())
      .replace('{skills}', formData.skills?.join(', ') || 'Not provided');
  }

  /**
   * Parse AI response into structured data
   */
  private parseAIResponse(response: string): any {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      const requiredFields = ['name', 'email', 'phone', 'experience', 'skills', 'overallConfidence', 'summary'];
      for (const field of requiredFields) {
        if (!(field in parsed)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return parsed;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Invalid AI response format');
    }
  }

  /**
   * Determine overall validation result based on confidence thresholds
   */
  private determineOverallValidation(result: any): boolean {
    const {
      name,
      email,
      phone,
      experience,
      skills,
      overallConfidence
    } = result;

    // Allow partial/semantic name match: if form name is a subset of CV name or vice versa, and confidence >= threshold
    const nameValid = (name.isMatch || this.isNameSubset(name.formValue, name.cvValue, name.confidence)) && name.confidence >= VALIDATION_CONFIG.nameConfidenceThreshold;
    const emailValid = email.isMatch && email.confidence >= VALIDATION_CONFIG.emailConfidenceThreshold;
    const phoneValid = !phone.isMatch || phone.confidence >= VALIDATION_CONFIG.phoneConfidenceThreshold; // Phone is optional
    const experienceValid = experience.isMatch && experience.confidence >= VALIDATION_CONFIG.experienceConfidenceThreshold;
    const skillsValid = skills.isMatch && skills.confidence >= VALIDATION_CONFIG.skillsConfidenceThreshold;

    // Overall validation passes if:
    // 1. Required fields (name, email, experience) are valid
    // 2. Overall confidence meets threshold
    return nameValid && emailValid && experienceValid && overallConfidence >= VALIDATION_CONFIG.overallConfidenceThreshold;
  }

  /**
   * Check if form name is a subset of CV name or vice versa, and confidence is reasonable
   */
  private isNameSubset(formName: string, cvName: string, confidence: number): boolean {
    if (!formName || !cvName) return false;
    const formParts = formName.toLowerCase().split(' ').filter(Boolean);
    const cvParts = cvName.toLowerCase().split(' ').filter(Boolean);
    // If all form parts are in CV name, or all CV parts are in form name, accept as valid if confidence >= 0.7
    const formInCV = formParts.every(part => cvParts.includes(part));
    const cvInForm = cvParts.every(part => formParts.includes(part));
    return (formInCV || cvInForm) && confidence >= 0.7;
  }

  /**
   * Generate mismatched fields for detailed feedback
   */
  private generateMismatchedFields(formData: any, result: any): MismatchedField[] {
    const mismatchedFields: MismatchedField[] = [];

    // Check name
    if (!result.name.isMatch) {
      mismatchedFields.push({
        fieldName: 'fullName',
        formValue: formData.fullName,
        pdfValue: result.name.cvValue,
        confidence: result.name.confidence,
        reason: result.name.reason || 'Name mismatch detected'
      });
    }

    // Check email
    if (!result.email.isMatch) {
      mismatchedFields.push({
        fieldName: 'email',
        formValue: formData.email,
        pdfValue: result.email.cvValue,
        confidence: result.email.confidence,
        reason: result.email.reason || 'Email mismatch detected'
      });
    }

    // Check phone (only if provided in form)
    if (formData.phone && !result.phone.isMatch) {
      mismatchedFields.push({
        fieldName: 'phone',
        formValue: formData.phone,
        pdfValue: result.phone.cvValue,
        confidence: result.phone.confidence,
        reason: result.phone.reason || 'Phone mismatch detected'
      });
    }

    // Check experience
    if (!result.experience.isMatch) {
      mismatchedFields.push({
        fieldName: 'yearsExperience',
        formValue: formData.yearsExperience,
        pdfValue: result.experience.cvValue,
        confidence: result.experience.confidence,
        reason: result.experience.reason || 'Experience mismatch detected'
      });
    }

    // Check skills (only if provided in form)
    if (formData.skills && formData.skills.length > 0 && !result.skills.isMatch) {
      mismatchedFields.push({
        fieldName: 'skills',
        formValue: formData.skills.join(', '),
        pdfValue: Array.isArray(result.skills.cvValue) ? result.skills.cvValue.join(', ') : result.skills.cvValue,
        confidence: result.skills.confidence,
        reason: result.skills.reason || 'Skills mismatch detected'
      });
    }

    return mismatchedFields;
  }

  /**
   * Validate experience with tolerance
   */
  private validateExperience(formValue: number, cvValue: number): boolean {
    const tolerance = VALIDATION_CONFIG.experienceTolerance;
    const difference = Math.abs(formValue - cvValue);
    
    // Special case for freshers (0-0.1 years)
    if (formValue <= VALIDATION_CONFIG.fresherExperienceThreshold && cvValue <= VALIDATION_CONFIG.fresherExperienceThreshold) {
      return true;
    }
    
    return difference <= tolerance;
  }

  /**
   * Validate skills with semantic matching
   */
  private validateSkills(formSkills: string[], cvSkills: string[]): boolean {
    if (!formSkills || formSkills.length === 0) {
      return true; // No skills to validate
    }

    const matchedSkills = formSkills.filter(formSkill => 
      cvSkills.some(cvSkill => 
        this.skillsMatch(formSkill, cvSkill)
      )
    );

    return matchedSkills.length >= formSkills.length * 0.7; // 70% match threshold
  }

  /**
   * Check if two skills match semantically
   */
  private skillsMatch(skill1: string, skill2: string): boolean {
    const normalized1 = skill1.toLowerCase().trim();
    const normalized2 = skill2.toLowerCase().trim();
    
    // Exact match
    if (normalized1 === normalized2) {
      return true;
    }
    
    // Check for common variations
    const variations = {
      'react': ['reactjs', 'react.js', 'react js'],
      'javascript': ['js', 'ecmascript'],
      'typescript': ['ts'],
      'node.js': ['nodejs', 'node'],
      'python': ['py'],
      'java': ['java 8', 'java 11'],
      'sql': ['mysql', 'postgresql', 'postgres'],
      'aws': ['amazon web services', 'amazon aws'],
      'docker': ['containerization'],
      'kubernetes': ['k8s', 'kube']
    };
    
    for (const [base, vars] of Object.entries(variations)) {
      if ((normalized1 === base && vars.includes(normalized2)) ||
          (normalized2 === base && vars.includes(normalized1))) {
        return true;
      }
    }
    
    return false;
  }
} 