import express from 'express';
import { removeProductFromWishlist } from '../controllers/wishlistController';
import { authenticateUser } from '../middleware/authMiddleware'; // Assume this exists

const router = express.Router();

router.delete('/products/:productId', 
  authenticateUser, 
  removeProductFromWishlist
);

export default router;