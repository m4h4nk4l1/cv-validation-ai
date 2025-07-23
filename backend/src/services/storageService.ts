import { uploadToStorage, deleteFromStorage } from '@/config/storage';
import { DatabaseService } from './databaseService';

export class StorageService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = new DatabaseService();
  }

  /**
   * Upload PDF file to Supabase storage and save metadata to database
   */
  async uploadPDF(userId: string, file: {
    originalname: string;
    buffer: Buffer;
    size: number;
  }): Promise<{
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
  }> {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${userId}_${timestamp}_${file.originalname}`;
      
      // Upload to Supabase storage
      const filePath = await uploadToStorage(file.buffer, fileName);
      
      // Save metadata to database
      const uploadRecord = await this.dbService.createCVUpload({
        userId,
        fileName,
        filePath,
        fileSize: file.size
      });

      return {
        id: uploadRecord.id,
        fileName: uploadRecord.fileName,
        filePath: uploadRecord.filePath,
        fileSize: uploadRecord.fileSize
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Delete PDF file from storage and database
   */
  async deletePDF(uploadId: string): Promise<void> {
    try {
      // Get upload record from database
      const uploadRecord = await this.dbService.getCVUploadById(uploadId);
      
      if (!uploadRecord) {
        throw new Error('Upload record not found');
      }

      // Delete from Supabase storage
      await deleteFromStorage(uploadRecord.fileName);
      
      // Delete from database
      await this.dbService.deleteCVUpload(uploadId);
    } catch (error) {
      console.error('File deletion error:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Get upload history for a user
   */
  async getUploadHistory(userId: string) {
    try {
      return await this.dbService.getCVUploadsByUserId(userId);
    } catch (error) {
      console.error('Get upload history error:', error);
      throw new Error('Failed to get upload history');
    }
  }

  /**
   * Get upload by ID
   */
  async getUploadById(uploadId: string) {
    try {
      return await this.dbService.getCVUploadById(uploadId);
    } catch (error) {
      console.error('Get upload error:', error);
      throw new Error('Failed to get upload');
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: {
    originalname: string;
    mimetype: string;
    size: number;
  }): void {
    // Check file type
    if (file.mimetype !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    // Check filename
    if (!file.originalname || file.originalname.trim() === '') {
      throw new Error('Invalid filename');
    }

    // Check for potentially dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (dangerousExtensions.includes(fileExtension)) {
      throw new Error('File type not allowed');
    }
  }

  /**
   * Generate secure filename
   */
  generateSecureFilename(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    
    return `${userId}_${timestamp}_${randomString}${extension}`;
  }

  /**
   * Get file size in human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 