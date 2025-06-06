import express, { Request, Response } from 'express';
import { Review, IReview } from '../models/Review';

const router = express.Router();

/**
 * GET endpoint to retrieve reviews for a specific product
 * @route GET /reviews/:productId
 * @param {string} productId - The ID of the product to fetch reviews for
 * @returns {Object} 200 - Array of reviews
 * @returns {Object} 400 - Bad request error
 * @returns {Object} 404 - No reviews found
 * @returns {Object} 500 - Server error
 */
router.get('/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Convert page and limit to numbers and ensure they are positive
    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.min(100, Math.max(1, Number(limit)));

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch reviews with pagination, sorted by most recent first
    const reviews: IReview[] = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    // Count total reviews for this product
    const totalReviews = await Review.countDocuments({ productId });

    // Calculate total pages
    const totalPages = Math.ceil(totalReviews / limitNumber);

    // If no reviews found
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this product' });
    }

    // Return paginated reviews
    return res.status(200).json({
      reviews,
      currentPage: pageNumber,
      totalPages,
      totalReviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error', error: String(error) });
  }
});

export default router;