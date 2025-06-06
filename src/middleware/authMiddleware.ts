import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/auth';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No token provided', 
      message: 'Authentication required' 
    });
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key (replace with your actual secret)
    const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';
    const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;

    // Attach the decoded user information to the request
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of JWT verification errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Token expired', 
        message: 'Your session has expired. Please log in again.' 
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        error: 'Invalid token', 
        message: 'Authentication failed. Invalid token.' 
      });
    }

    // For any other unexpected errors
    return res.status(500).json({ 
      error: 'Authentication error', 
      message: 'An unexpected error occurred during authentication.' 
    });
  }
};