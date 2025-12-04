import { ErrorCode, type ApiResponse } from '../api/api.response';
import logger from '../logging/logger';

export class ApiResponseHelper {
  public static buildResponse<T>(
    success: boolean,
    message: string,
    statusCode: number,
    options: {
      data?: T;
      error?: string;
      path?: string;
    },
  ): ApiResponse<T> {
    const { data, error, path = '/' } = options;

    return {
      success,
      message,
      data,
      error,
      statusCode,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  static success<T>(message: string, data?: T, path?: string): ApiResponse<T> {
    logger.info(message, { path });

    return this.buildResponse(true, message, 200, { data, path });
  }

  static created<T>(message: string, data?: T, path?: string): ApiResponse<T> {
    logger.info(message, { path });

    return this.buildResponse(true, message, 201, { data, path });
  }

  static badRequest(message = 'Bad request', path?: string): ApiResponse {
    logger.warn(message, { path });

    return this.buildResponse(false, message, 400, { error: ErrorCode.BAD_REQUEST, path });
  }

  static unauthorized(message = 'Unauthorized', path?: string): ApiResponse {
    return this.buildResponse(false, message, 401, {
      error: ErrorCode.UNAUTHORIZED,
      path,
    });
  }

  static forbidden(message = 'Forbidden', path?: string): ApiResponse {
    return this.buildResponse(false, message, 403, {
      error: ErrorCode.FORBIDDEN,
      path,
    });
  }

  static notFound(message = 'Not found', path?: string): ApiResponse {
    return this.buildResponse(false, message, 404, {
      error: ErrorCode.NOT_FOUND,
      path,
    });
  }

  static internal(message = 'Internal server error', path?: string, err?: any): ApiResponse {
    logger.error(message, { path, err });

    return this.buildResponse(false, message, 500, {
      error: ErrorCode.INTERNAL_ERROR,
      path,
    });
  }
}
