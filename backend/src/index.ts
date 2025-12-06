import express, { type Request, type Response } from 'express';
import path from 'path';
import { ENV } from './configs/env';
import mongoose from 'mongoose';
import { connectToDb } from './db/connectToDb';
import { clerkMiddleware } from '@clerk/express';
import { errorMiddleware } from './middlewares/error.middleware';
import morgan from 'morgan';
import logger from './logging/logger';
import helmet from 'helmet';
import { serve } from 'inngest/express';
import { functions, inngest } from './libs/inngest';
import adminRoutes from './routes/admin.route';
import userRoutes from './routes/user.route';
import orderRoutes from './routes/order.route';
import reviewRoutes from './routes/review.route';
import productRoutes from './routes/product.route';
import cartRoutes from './routes/cart.route';
import cors from 'cors';

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
  cors({
    origin: ENV.NODE_ENV === 'production' ? ENV.CLIENT_URL : 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(
  '/api/inngest',
  serve({
    client: inngest,
    functions,
  }),
);

app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

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
    res.sendFile(path.join(__dirname, '../admin', 'dist', 'index.html'));
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
