import type { Request, Response, NextFunction } from 'express';
import logger from '../logging/logger';
import { ApiResponseHelper } from '../helpers/api.helper';
import { ENV } from '../configs/env';

export function errorMiddleware(error: any, req: Request, res: Response, _next: NextFunction) {
  const status = error.statusCode || 500;
  const message =
    ENV.NODE_ENV === 'development'
      ? error.message || 'Internal server error'
      : 'Internal server error';

  logger.error('Unhandled Exception', {
    message: error.message,
    stack: ENV.NODE_ENV === 'development' ? error.stack : undefined,
    path: req.path,
  });
  switch (status) {
    case 400:
      return res.status(400).json(ApiResponseHelper.badRequest(message, req.path));
    case 401:
      return res.status(401).json(ApiResponseHelper.unauthorized(message, req.path));
    case 403:
      return res.status(403).json(ApiResponseHelper.forbidden(message, req.path));
    case 404:
      return res.status(404).json(ApiResponseHelper.notFound(message, req.path));
    default:
      return res.status(500).json(ApiResponseHelper.internal(message, req.path, error));
  }
}
