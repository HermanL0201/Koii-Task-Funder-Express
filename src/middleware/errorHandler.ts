import { Request, Response, NextFunction } from 'express';

// Custom error class for standardized error handling
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
}

// Centralized error handling middleware
export const errorHandler = (
  err: AppError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const responseError: ErrorResponse = {
    status: err.status,
    message: err.message
  };

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    responseError.stack = err.stack;
  }

  res.status(err.statusCode).json(responseError);
};

// Wrapper for async route handlers to catch async errors
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Handle 404 Not Found errors
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
};