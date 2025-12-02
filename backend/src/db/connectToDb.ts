import mongoose from 'mongoose';
import { ENV } from '../configs/env';
import logger from '../logging/logger';

export const connectToDb = async () => {
  try {
    if (mongoose.connections[0]?.readyState) {
      logger.info('already connected to db');
      return;
    }
    await mongoose.connect(ENV.DB_URL as string).then(() => {
      logger.info('connected to db succesfully 🛢️');
    });
  } catch (error) {
    logger.error(
      `something goes wrong connecting to db => ${error instanceof Error ? error.message : error}`,
    );
    process.exit(1);
  }
};
