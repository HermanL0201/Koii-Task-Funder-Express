import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../src/middleware/authMiddleware';

describe('Authentication Middleware', () => {
  const SECRET_KEY = 'test_secret_key';
  
  // Mock Express objects
  const createMockRequest = (token?: string) => {
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : undefined
      }
    } as Request;
  };

  const createMockResponse = () => {
    return {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
  };

  const mockNext = vi.fn() as NextFunction;

  it('should reject requests without a token', () => {
    const req = createMockRequest();
    const res = createMockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'No token provided'
    }));
  });

  it('should reject requests with an invalid token format', () => {
    const req = { headers: { authorization: 'InvalidTokenFormat' } } as Request;
    const res = createMockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'No token provided'
    }));
  });

  it('should successfully validate a valid token', () => {
    // Create a valid token
    const validToken = jwt.sign(
      { userId: '123', role: 'user' }, 
      process.env.JWT_SECRET || 'default_secret_key'
    );

    const req = createMockRequest(validToken);
    const res = createMockResponse();

    authMiddleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user?.userId).toBe('123');
  });

  it('should reject an expired token', () => {
    // Create an expired token
    const expiredToken = jwt.sign(
      { userId: '123', role: 'user' }, 
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '-1s' }  // Expired token
    );

    const req = createMockRequest(expiredToken);
    const res = createMockResponse();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Token expired'
    }));
  });
});