import express from 'express';
import { WishlistController } from '../controllers/WishlistController';
import { authenticate } from '../middleware/authMiddleware'; // Assuming this middleware exists

const router = express.Router();

/**
 * GET /api/wishlist
 * Retrieve the current user's wishlist
 * Requires authentication
 */
router.get('/', authenticate, WishlistController.getWishlist);

export default router;