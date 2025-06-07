import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { errorHandler, AppError } from '../../src/middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('Error Handling Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock the console.error to prevent actual logging during tests
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();

    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      statusCode: 200
    };
    mockNext = vi.fn();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should handle standard error with default status code', () => {
    const testError = new Error('Test Error');

    errorHandler(
      testError, 
      mockRequest as Request, 
      mockResponse as Response, 
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      status: 500,
      message: 'Test Error'
    }));
  });

  it('should use provided status code', () => {
    const testError = new Error('Not Found');
    mockResponse.statusCode = 404;

    errorHandler(
      testError, 
      mockRequest as Request, 
      mockResponse as Response, 
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      status: 404,
      message: 'Not Found'
    }));
  });

  it('should create AppError with custom status code', () => {
    const customError = new AppError('Unauthorized', 401);

    errorHandler(
      customError, 
      mockRequest as Request, 
      mockResponse as Response, 
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      status: 401,
      message: 'Unauthorized'
    }));
  });
});