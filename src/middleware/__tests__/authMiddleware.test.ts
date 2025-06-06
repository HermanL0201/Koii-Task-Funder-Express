import { describe, it, expect, vi } from 'vitest';
import { authMiddleware } from '../authMiddleware';
import jwt from 'jsonwebtoken';

describe('Authentication Middleware', () => {
  const mockNext = vi.fn();
  const mockSecret = 'test_secret';

  // Mocked request, response, and next function
  const createMockReq = (token?: string) => ({
    headers: {
      authorization: token ? `Bearer ${token}` : undefined
    }
  });

  const mockRes: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };

  // Mock environment variable
  process.env.JWT_SECRET = mockSecret;

  it('should reject requests without authorization header', () => {
    const req: any = createMockReq();
    
    authMiddleware(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'No token provided',
      error: 'Unauthorized'
    }));
  });

  it('should reject requests with invalid token format', () => {
    const req: any = { headers: { authorization: 'InvalidFormat' } };
    
    authMiddleware(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'No token provided',
      error: 'Unauthorized'
    }));
  });

  it('should successfully validate a valid token', () => {
    // Create a valid token
    const validToken = jwt.sign({ userId: '123' }, mockSecret, { expiresIn: '1h' });
    const req: any = createMockReq(validToken);
    
    authMiddleware(req, mockRes, mockNext);

    expect(req.user).toEqual({ id: '123' });
    expect(mockNext).toHaveBeenCalled();
  });

  it('should reject an expired token', () => {
    // Create an expired token
    const expiredToken = jwt.sign({ userId: '123' }, mockSecret, { expiresIn: '-1h' });
    const req: any = createMockReq(expiredToken);
    
    authMiddleware(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Token expired',
      error: 'Unauthorized'
    }));
  });

  it('should reject a token with invalid signature', () => {
    const invalidToken = jwt.sign({ userId: '123' }, 'wrong_secret');
    const req: any = createMockReq(invalidToken);
    
    authMiddleware(req, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invalid token',
      error: 'Unauthorized'
    }));
  });
});