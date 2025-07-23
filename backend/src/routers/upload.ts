import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { StorageService } from '../services/storageService';

const t = initTRPC.create();
const storage = new StorageService();

export const uploadRouter = t.router({
  getUploadHistory: t.procedure
    .input(z.object({ userId: z.string().min(1) }))
    .query(async ({ input }) => {
      return storage.getUploadHistory(input.userId);
    }),

  getUploadById: t.procedure
    .input(z.object({ uploadId: z.string().min(1) }))
    .query(async ({ input }) => {
      return storage.getUploadById(input.uploadId);
    }),
}); 