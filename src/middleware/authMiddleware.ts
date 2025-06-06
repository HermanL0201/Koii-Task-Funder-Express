import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JwtPayload {
  userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'No token provided',
      error: 'Unauthorized'
    });
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the JWT secret (replace with your actual secret)
    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach the user information to the request object
    req.user = { id: decoded.userId };

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of JWT verification errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        message: 'Token expired',
        error: 'Unauthorized'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'Unauthorized'
      });
    }

    // Generic error handling
    return res.status(500).json({ 
      message: 'Authentication error',
      error: 'Internal Server Error'
    });
  }
};