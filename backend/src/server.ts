import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { appRouter } from './routers';
import { errorHandler, notFoundHandler } from './utils/errorHandling';
import { StorageService } from './services/storageService';
import { connectDatabase } from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
});

// tRPC API
app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
}));

// File upload endpoint
app.post('/upload', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const file = req.file;
    if (!userId || !file) {
      return res.status(400).json({ error: 'userId and file are required' });
    }
    const storageService = new StorageService();
    const result = await storageService.uploadPDF(userId, file);

    // Extract PDF text after upload
    const { PDFProcessingService } = await import('./services/pdfProcessingService');
    const pdfService = new PDFProcessingService();
    const pdfText = await pdfService.extractTextFromPDF(file.buffer);

    res.status(200).json({ success: true, ...result, pdfText });
  } catch (error) {
    next(error);
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server after DB connection
connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}); 