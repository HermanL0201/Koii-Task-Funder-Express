import { Request, Response, NextFunction } from 'express';

// Mock authentication middleware for testing
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Simulate authenticated user
  req.user = { id: 'user123' };
  next();
};