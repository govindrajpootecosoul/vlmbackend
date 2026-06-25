import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

export const createApp = () => {
  const app = express();

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some((o) => origin === o || origin.endsWith('.vercel.app'))) {
        callback(null, true);
      } else {
        callback(null, allowedOrigins[0] || true);
      }
    },
    credentials: true,
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Connect DB on each cold start (cached inside connectDB)
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (err) {
      next(err);
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'VLM Academy API is running', timestamp: new Date() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/teacher', teacherRoutes);
  app.use('/api/student', studentRoutes);
  app.use('/api/parent', parentRoutes);
  app.use('/api/sessions', sessionRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
