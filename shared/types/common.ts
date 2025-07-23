export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FileUpload {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedAt: Date;
  createdAt: Date;
}

export interface UploadRequest {
  userId: string;
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  };
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

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
} 