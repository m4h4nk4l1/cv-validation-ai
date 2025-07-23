import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { DatabaseService } from '../services/databaseService';

const t = initTRPC.create();
const db = new DatabaseService();

export const userRouter = t.router({
  createUser: t.procedure
    .input(z.object({
      fullName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      yearsExperience: z.number().min(0).max(30),
      skills: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createUser(input);
    }),

  getUserById: t.procedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ input }) => {
      return db.getUserById(input.id);
    }),
}); 