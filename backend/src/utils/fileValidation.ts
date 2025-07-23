import { VALIDATION_CONFIG } from '@/types/shared';

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}

export class FileValidator {
  /**
   * Validate PDF file
   */
  static validatePDF(file: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer?: Buffer;
  }): FileValidationResult {
    const errors: string[] = [];

    // Check if file exists
    if (!file) {
      errors.push('No file provided');
      return { isValid: false, errors };
    }

    // Check file type
    if (file.mimetype !== 'application/pdf') {
      errors.push('Only PDF files are allowed');
    }

    // Check file size
    if (file.size > VALIDATION_CONFIG.maxFileSize) {
      errors.push(`File size must be less than ${VALIDATION_CONFIG.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check if file is empty
    if (file.size === 0) {
      errors.push('File cannot be empty');
    }

    // Check filename
    if (!file.originalname || file.originalname.trim() === '') {
      errors.push('Invalid filename');
    }

    // Check for dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.php'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (dangerousExtensions.includes(fileExtension)) {
      errors.push('File type not allowed');
    }

    // Check filename length
    if (file.originalname.length > 255) {
      errors.push('Filename too long');
    }

    // Check for special characters in filename
    const invalidChars = /[<>:"/\\|?*]/;
    if (invalidChars.test(file.originalname)) {
      errors.push('Filename contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate file buffer
   */
  static validateBuffer(buffer: Buffer): FileValidationResult {
    const errors: string[] = [];

    if (!buffer || buffer.length === 0) {
      errors.push('File buffer is empty');
      return { isValid: false, errors };
    }

    // Check if it's actually a PDF by checking the magic number
    const pdfMagicNumber = Buffer.from('%PDF');
    if (buffer.length < 4 || !buffer.subarray(0, 4).equals(pdfMagicNumber)) {
      errors.push('File does not appear to be a valid PDF');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get file extension
   */
  static getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.')).toLowerCase();
  }

  /**
   * Generate safe filename
   */
  static generateSafeFilename(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = this.getFileExtension(originalName);
    
    return `${userId}_${timestamp}_${randomString}${extension}`;
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if file size is within limits
   */
  static isFileSizeValid(size: number): boolean {
    return size > 0 && size <= VALIDATION_CONFIG.maxFileSize;
  }

  /**
   * Check if file type is allowed
   */
  static isFileTypeAllowed(mimetype: string): boolean {
    return (VALIDATION_CONFIG.allowedMimeTypes as readonly string[]).includes(mimetype);
  }
} 