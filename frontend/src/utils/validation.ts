import { z } from 'zod';

export const cvFormSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  yearsExperience: z.coerce.number().min(0, 'Years of experience cannot be negative').max(30, 'Years of experience cannot exceed 30'),
  skills: z.string().optional(), // comma-separated string
  file: z
    .any()
    .refine((file) => file && file.length === 1, {
      message: 'Please upload a file',
    })
    .refine((file) => {
      if (!file || file.length === 0) return false;
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      return allowedTypes.includes(file[0]?.type);
    }, {
      message: 'Only PDF, DOCX, and DOC files are allowed',
    })
    .refine((file) => file && file[0]?.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    }),
});

export type CVFormSchema = z.infer<typeof cvFormSchema>; 