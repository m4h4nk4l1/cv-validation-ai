import pdf from 'pdf-parse';
import { VALIDATION_CONFIG } from '@/types/shared';

export class PDFProcessingService {
  /**
   * Extract text content from PDF buffer
   */
  async extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
      const data = await pdf(buffer);
      return data.text;
    } catch (error) {
      console.error('PDF processing error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Clean and normalize extracted text
   */
  cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim();
  }

  /**
   * Extract specific sections from CV text
   */
  extractSections(text: string) {
    const cleanedText = this.cleanText(text);
    
    return {
      fullText: cleanedText,
      // Extract potential name patterns
      potentialNames: this.extractPotentialNames(cleanedText),
      // Extract potential email patterns
      potentialEmails: this.extractPotentialEmails(cleanedText),
      // Extract potential phone patterns
      potentialPhones: this.extractPotentialPhones(cleanedText),
      // Extract potential experience patterns
      potentialExperience: this.extractPotentialExperience(cleanedText),
      // Extract potential skills
      potentialSkills: this.extractPotentialSkills(cleanedText)
    };
  }

  private extractPotentialNames(text: string): string[] {
    const namePatterns = [
      /(?:name|full name|fullname)[\s:]*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/gi,
      /([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/g
    ];

    const names: string[] = [];
    namePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const name = match.replace(/^(?:name|full name|fullname)[\s:]*/i, '').trim();
          if (name.length > 2 && name.length < 50) {
            names.push(name);
          }
        });
      }
    });

    return [...new Set(names)];
  }

  private extractPotentialEmails(text: string): string[] {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailPattern);
    return matches ? [...new Set(matches)] : [];
  }

  private extractPotentialPhones(text: string): string[] {
    const phonePatterns = [
      /[\+]?[1-9][\d]{0,15}/g,
      /\(\d{3}\)\s?\d{3}-\d{4}/g,
      /\d{3}-\d{3}-\d{4}/g
    ];

    const phones: string[] = [];
    phonePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const phone = match.replace(/[^\d+]/g, '');
          if (phone.length >= 10 && phone.length <= 15) {
            phones.push(phone);
          }
        });
      }
    });

    return [...new Set(phones)];
  }

  private extractPotentialExperience(text: string): string[] {
    const experiencePatterns = [
      /(\d+(?:\.\d+)?)\s*(?:years?|yrs?)\s*(?:of\s*)?experience/gi,
      /experience[\s:]*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/gi,
      /(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/g
    ];

    const experiences: string[] = [];
    experiencePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const experience = match.replace(/[^\d.]/g, '');
          const num = parseFloat(experience);
          if (!isNaN(num) && num >= 0 && num <= 30) {
            experiences.push(experience);
          }
        });
      }
    });

    return [...new Set(experiences)];
  }

  private extractPotentialSkills(text: string): string[] {
    const skillPatterns = [
      /(?:skills?|technologies?|programming languages?)[\s:]*([^.\n]+)/gi,
      /(?:proficient in|experience with|knowledge of)[\s:]*([^.\n]+)/gi
    ];

    const skills: string[] = [];
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const skillSection = match.replace(/^(?:skills?|technologies?|programming languages?)[\s:]*/i, '');
          const individualSkills = skillSection.split(/[,;&]/).map(s => s.trim()).filter(s => s.length > 0);
          skills.push(...individualSkills);
        });
      }
    });

    return [...new Set(skills)];
  }

  /**
   * Validate PDF file
   */
  validatePDF(file: {
    mimetype: string;
    size: number;
  }): void {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    if (file.size > VALIDATION_CONFIG.maxFileSize) {
      throw new Error(`File size must be less than ${VALIDATION_CONFIG.maxFileSize / (1024 * 1024)}MB`);
    }
  }
} 