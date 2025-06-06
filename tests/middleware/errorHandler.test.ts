import { expect, describe, it, vi } from 'vitest';
import { AppError, errorHandler } from '../../src/middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('Error Handling Middleware', () => {
  const mockRequest = {} as Request;
  const mockNext = vi.fn() as unknown as NextFunction;
  
  it('should handle operational errors correctly', () => {
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const operationalError = new AppError('Test operational error', 400);

    errorHandler(operationalError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        statusCode: 400,
        message: 'Test operational error'
      })
    );
  });

  it('should handle unexpected errors with a 500 status', () => {
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    const unexpectedError = new Error('Unexpected error');

    errorHandler(unexpectedError, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong'
      })
    );
  });

  it('should create an AppError with correct properties', () => {
    const error = new AppError('Test error', 404, true);

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });
});