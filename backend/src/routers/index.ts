import { initTRPC } from '@trpc/server';
import { userRouter } from './user';
import { uploadRouter } from './upload';
import { validationRouter } from './validation';

const t = initTRPC.create();

export const appRouter = t.router({
  user: userRouter,
  upload: uploadRouter,
  validation: validationRouter,
});

export type AppRouter = typeof appRouter; 