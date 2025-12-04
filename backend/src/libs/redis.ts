import Redis from 'ioredis';
import { ENV } from '../configs/env';
import logger from '../logging/logger';

export const redis = new Redis(ENV.REDIS_URL as string);

redis.on('connect', () => {
  logger.info('Redis connected successfully');
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

redis.on('ready', () => {
  logger.info('Redis ready to accept commands');
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});
