import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

// Custom error class for more detailed errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Ensures the correct prototype chain is maintained
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Central error handling middleware
export const errorHandler = (
  err: Error | AppError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Default to 500 internal server error if not an AppError
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const isOperational = err instanceof AppError ? err.isOperational : false;

  // Log the error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    method: req.method,
    path: req.path,
    isOperational
  });

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: isOperational ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Async error wrapper to simplify error handling in route handlers
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};