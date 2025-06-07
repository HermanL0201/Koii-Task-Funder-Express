import { Request, Response, NextFunction } from 'express';

/**
 * Global error handling middleware
 * Catches and processes unhandled errors in the API
 * Provides a consistent error response format
 */
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Log the error for server-side tracking
  console.error(`[Error Handler] ${err.message}`, err.stack);

  // Check if the error is an AppError with a custom status code
  const statusCode = err instanceof AppError 
    ? err.statusCode 
    : res.statusCode === 200 
      ? 500 
      : res.statusCode;

  // Construct a standardized error response
  const errorResponse = {
    success: false,
    status: statusCode,
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Send the error response
  res.status(statusCode).json(errorResponse);
};

// Custom error class for more specific error handling
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}