import express, { type Request, type Response } from 'express';
import path from 'path';
import { ENV } from './configs/env';
import mongoose from 'mongoose';
import { connectToDb } from './db/connectToDb';
import { clerkMiddleware } from '@clerk/express';
import morgan from 'morgan';
import logger from './logging/logger';
import helmet from 'helmet';
import { serve } from 'inngest/express';
import { functions, inngest } from './libs/inngest';
import adminRoutes from './routes/admin.route';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();
const PORT = ENV.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(morgan('dev', { stream: { write: (msg) => logger.http(msg.trim()) } }));

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(clerkMiddleware());
app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions,
  }),
);

app.use('/api/admin', adminRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  logger.info('Health Check');
  return res.status(200).json({
    messsage: 'OK',
    success: true,
    timestamp: new Date().toISOString(),
  });
});

app.use(errorMiddleware);

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../admin/dist')));
  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      logger.info(`app is running on port ${PORT} ⚡️`);
    });
  } catch (error) {
    logger.error(`internal server error ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};

startServer();

// Graceful Shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
