export interface ValidationResult {
  id: string;
  userId: string;
  isValid: boolean;
  mismatchedFields: MismatchedField[];
  confidenceScore: number;
  validatedAt: Date;
  createdAt: Date;
}

export interface MismatchedField {
  fieldName: string;
  formValue: string | number;
  pdfValue?: string | number;
  confidence: number;
  reason: string;
}

export interface ValidationRequest {
  userId: string;
  formData: {
    fullName: string;
    email: string;
    phone?: string;
    yearsExperience: number;
    skills?: string[];
  };
  pdfText: string;
}

export interface ValidationResponse {
  isValid: boolean;
  mismatchedFields: MismatchedField[];
  confidenceScore: number;
  summary: string;
}

export interface FieldValidation {
  fieldName: string;
  isMatch: boolean;
  confidence: number;
  formValue: string | number;
  pdfValue?: string | number;
  reason: string;
}

export interface ValidationConfig {
  nameConfidenceThreshold: number;
  emailConfidenceThreshold: number;
  phoneConfidenceThreshold: number;
  experienceConfidenceThreshold: number;
  skillsConfidenceThreshold: number;
  overallConfidenceThreshold: number;
} 