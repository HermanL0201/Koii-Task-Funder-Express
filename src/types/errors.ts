/**
 * Custom error classes for product-related errors
 */
export class ProductNotFoundError extends Error {
  statusCode: number;

  constructor(message: string = 'Product not found') {
    super(message);
    this.name = 'ProductNotFoundError';
    this.statusCode = 404;
  }
}

export class ProductValidationError extends Error {
  statusCode: number;

  constructor(message: string = 'Invalid product data') {
    super(message);
    this.name = 'ProductValidationError';
    this.statusCode = 400;
  }
}

export class ProductDatabaseError extends Error {
  statusCode: number;

  constructor(message: string = 'Database error while processing product') {
    super(message);
    this.name = 'ProductDatabaseError';
    this.statusCode = 500;
  }
}

// Generic interface for error response
export interface ErrorResponse {
  status: 'error';
  statusCode: number;
  message: string;
}