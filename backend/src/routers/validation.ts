import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { CVValidationService } from '../services/cvValidationService';

const t = initTRPC.create();
const validator = new CVValidationService();

export const validationRouter = t.router({
  validateCV: t.procedure
    .input(z.object({
      formData: z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        yearsExperience: z.number().min(0).max(30),
        skills: z.array(z.string()).optional(),
      }),
      pdfText: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return validator.validateCV(input.formData, input.pdfText);
    }),
}); 