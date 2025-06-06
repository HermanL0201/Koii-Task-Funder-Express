import { Router, Request, Response } from 'express';
import Review, { IReview } from '../models/Review';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

router.post('/reviews', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // Validate inputs
    if (!productId || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ 
      productId, 
      userId: req.user?.id 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create new review
    const newReview: IReview = new Review({
      productId,
      userId: req.user?.id,
      rating,
      comment,
      createdAt: new Date()
    });

    await newReview.save();

    res.status(201).json({
      message: 'Review submitted successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: 'Server error while submitting review' });
  }
});

export default router;