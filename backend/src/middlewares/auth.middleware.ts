import { requireAuth } from '@clerk/express';
import type { NextFunction, Request, Response } from 'express';
import { ApiResponseHelper } from '../helpers/api.helper';
import { User, type IUserDocument } from '../models/user.model';
import logger from '../logging/logger';
import { ENV } from '../configs/env';

declare global {
  namespace Express {
    export interface Request {
      auth: () => {
        userId: string;
      };
      user: IUserDocument;
    }
  }
}

export const protectRoute = [
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('authorizing user ...');
      const clerkId = req.auth()?.userId;
      if (!clerkId)
        return res.status(401).json(ApiResponseHelper.unauthorized('invalid token', req.path));
      const user = await User.findOne({ clerkId });
      if (!user)
        return res.status(404).json(ApiResponseHelper.notFound('user not found', req.path));
      req.user = user;
      logger.info('user credentials set succesfully');
      next();
    } catch (error) {
      logger.error(error instanceof Error ? error.message : 'failed to authorize user');
      return res
        .status(500)
        .json(
          ApiResponseHelper.internal(
            'internal server error',
            req.path,
            error instanceof Error ? error.message : 'failed to authorize user',
          ),
        );
    }
  },
];

export const adminRoute = async (req: Request, res: Response, next: NextFunction) => {
  logger.info('check if user is admin ...');
  if (!req.user) {
    return res.status(401).json(ApiResponseHelper.unauthorized('unauthorized', req.path));
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res
      .status(403)
      .json(ApiResponseHelper.forbidden('forbidden - only admin allowed', req.path));
  }
  logger.info('check admin completed');
  next();
};
