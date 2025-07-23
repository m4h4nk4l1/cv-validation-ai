import { z } from 'zod';

export const validationRequestSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  formData: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    yearsExperience: z.number().min(0).max(30),
    skills: z.array(z.string()).optional().default([])
  }),
  pdfText: z.string().min(1, 'PDF text is required')
});

export const validationResponseSchema = z.object({
  isValid: z.boolean(),
  mismatchedFields: z.array(z.object({
    fieldName: z.string(),
    formValue: z.union([z.string(), z.number()]),
    pdfValue: z.union([z.string(), z.number()]).optional(),
    confidence: z.number().min(0).max(1),
    reason: z.string()
  })),
  confidenceScore: z.number().min(0).max(1),
  summary: z.string()
});

export const fileUploadSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine((val) => val === 'application/pdf', {
      message: 'Only PDF files are allowed'
    }),
    size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
    destination: z.string(),
    filename: z.string(),
    path: z.string(),
    buffer: z.instanceof(Buffer)
  })
});

export const userCreateSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  yearsExperience: z.number().min(0).max(30),
  skills: z.array(z.string()).optional().default([])
});

export const userUpdateSchema = userCreateSchema.partial();

export type ValidationRequest = z.infer<typeof validationRequestSchema>;
export type ValidationResponse = z.infer<typeof validationResponseSchema>;
export type FileUploadRequest = z.infer<typeof fileUploadSchema>;
export type UserCreateRequest = z.infer<typeof userCreateSchema>;
export type UserUpdateRequest = z.infer<typeof userUpdateSchema>; 