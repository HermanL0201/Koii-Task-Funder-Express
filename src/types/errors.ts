/**
 * Custom error classes for application-wide error handling
 */
export class BaseCustomError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    message: string, 
    statusCode: number, 
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Ensures that the error can be properly traced in subclasses
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Product-specific error classes
 */
export class ProductNotFoundError extends BaseCustomError {
  constructor(message: string = 'Product not found') {
    super(message, 404);
  }
}

export class ProductValidationError extends BaseCustomError {
  constructor(message: string = 'Invalid product data') {
    super(message, 400);
  }
}

export class ProductDatabaseError extends BaseCustomError {
  constructor(message: string = 'Database error while processing product') {
    super(message, 500, false); // Not operational, indicates a system issue
  }
}

// Generic interface for standardized error response
export interface ErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
  errors?: string[];
}

// Error handling utility functions
export class ErrorHandler {
  /**
   * Create a standardized error response
   * @param error Error object
   * @returns Formatted error response
   */
  static createErrorResponse(error: Error): ErrorResponse {
    const baseResponse: ErrorResponse = {
      status: 'error',
      statusCode: error instanceof BaseCustomError ? error.statusCode : 500,
      message: error.message
    };

    return baseResponse;
  }
}