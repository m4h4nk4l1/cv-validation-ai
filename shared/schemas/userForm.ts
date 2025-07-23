import { z } from 'zod';

export const userFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: 'Please enter a valid phone number'
    }),
  
  yearsExperience: z
    .number()
    .min(0, 'Years of experience cannot be negative')
    .max(30, 'Years of experience cannot exceed 30')
    .step(0.1, 'Years of experience must be in 0.1 increments'),
  
  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .optional()
    .default([])
});

export const createUserSchema = userFormSchema.extend({
  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .optional()
    .default([])
});

export const updateUserSchema = userFormSchema.partial();

export type UserFormData = z.infer<typeof userFormSchema>;
export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>; 