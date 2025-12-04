import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponseHelper } from '../helpers/api.helper';
import { ErrorCode } from '../api/api.response';

type DataSource = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, source: DataSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req[source]);
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          code: issue.code,
          message: issue.message,
        }));

        const path = req.originalUrl;
        const response = ApiResponseHelper.buildResponse(
          false,
          'Validation failed. Check the errors for details.',
          400,
          {
            data: formattedErrors,
            error: ErrorCode.VALIDATION_ERROR,
            path,
          },
        );

        return res.status(400).json(response);
      }

      console.error('Unexpected error in validation middleware:', error);
      const internalResponse = ApiResponseHelper.internal(
        'Unexpected error during validation',
        req.originalUrl,
        error,
      );
      return res.status(500).json(internalResponse);
    }
  };
};
