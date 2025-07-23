export interface CVFormData {
  fullName: string;
  email: string;
  phone?: string;
  yearsExperience: number;
  skills?: string[];
  file?: FileList | null;
}

export interface ValidationResult {
  isValid: boolean;
  mismatchedFields: Array<{
    fieldName: string;
    formValue: string | number;
    pdfValue?: string | number;
    confidence: number;
    reason: string;
  }>;
  confidenceScore: number;
  summary: string;
} 