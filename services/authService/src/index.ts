import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';

import { config } from './config/env';
import { connectDB, disconnectDB } from './config/db';
import { logger } from './utils/logger';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// ─── App Setup ────────────────────────────────────────────────
const app = express();

// ─── Security Middleware ──────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── General Middleware ───────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(config.isDev ? 'dev' : 'combined'));

// ─── Static: serve uploaded photos ───────────────────────────
app.use(
  '/uploads',
  express.static(path.resolve(config.upload.dir))
);

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ─── 404 + Error Handlers ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`Auth service running on port ${config.port} [${config.nodeEnv}]`);
    logger.info(`Health: http://localhost:${config.port}/health`);
  });

  // ─── Graceful shutdown ────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
  });
}

bootstrap();
