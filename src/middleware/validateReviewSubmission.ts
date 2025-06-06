import { Request, Response, NextFunction } from 'express';

interface ReviewSubmission {
  productId: string;
  rating: number;
  comment?: string;
  title?: string;
}

export const validateReviewSubmission = (req: Request, res: Response, next: NextFunction) => {
  const { productId, rating, comment, title } = req.body as ReviewSubmission;

  // Validate productId
  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    return res.status(400).json({ 
      error: 'Invalid product ID. Product ID is required and must be a non-empty string.' 
    });
  }

  // Validate rating
  if (rating === undefined || !Number.isInteger(rating)) {
    return res.status(400).json({ 
      error: 'Invalid rating. Rating must be an integer.' 
    });
  }

  // Validate rating range
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ 
      error: 'Invalid rating. Rating must be between 1 and 5.' 
    });
  }

  // Optional comment validation
  if (comment !== undefined) {
    if (typeof comment !== 'string') {
      return res.status(400).json({ 
        error: 'Comment must be a string.' 
      });
    }

    // Optional comment length validation
    if (comment.trim().length > 500) {
      return res.status(400).json({ 
        error: 'Comment must be 500 characters or less.' 
      });
    }
  }

  // Optional title validation
  if (title !== undefined) {
    if (typeof title !== 'string') {
      return res.status(400).json({ 
        error: 'Title must be a string.' 
      });
    }

    // Optional title length validation
    if (title.trim().length > 100) {
      return res.status(400).json({ 
        error: 'Title must be 100 characters or less.' 
      });
    }
  }

  // If all validations pass, continue to the next middleware/route handler
  next();
};