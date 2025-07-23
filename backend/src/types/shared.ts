// Re-export shared types and constants for backend use
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  yearsExperience: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  proficiencyLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  createdAt: Date;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  phone?: string;
  yearsExperience: number;
  skills?: string[];
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  yearsExperience?: number;
  skills?: string[];
}

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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResult<T> = SuccessResponse<T> | ErrorResponse;

export const VALIDATION_CONFIG = {
  // Confidence thresholds for different field types
  nameConfidenceThreshold: 0.8,
  emailConfidenceThreshold: 0.9,
  phoneConfidenceThreshold: 0.85,
  experienceConfidenceThreshold: 0.7,
  skillsConfidenceThreshold: 0.6,
  overallConfidenceThreshold: 0.7,

  // Experience validation rules
  experienceTolerance: 0.5, // ±0.5 years tolerance
  fresherExperienceThreshold: 0.1, // Consider 0-0.1 years as fresher

  // File upload limits
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ['application/pdf'],

  // AI prompt configuration
  aiConfig: {
    temperature: 0.1, // Low temperature for consistent results
    maxTokens: 2000,
    model: 'gpt-4' as const
  }
} as const; 