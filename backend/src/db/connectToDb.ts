import mongoose from 'mongoose';
import { ENV } from '../configs/env';

export const connectToDb = async () => {
  try {
    if (mongoose.connections[0]?.readyState) {
      console.log('already connected to db');
      return;
    }
    await mongoose.connect(ENV.DB_URL as string).then(() => {
      console.log('connected to db succesfully 🛢️');
    });
  } catch (error) {
    console.log(
      '🌋 something goes wrong connecting to the db => ',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};
