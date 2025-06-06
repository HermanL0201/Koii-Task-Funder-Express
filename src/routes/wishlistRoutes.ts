import express from 'express';
import { addToWishlist } from '../controllers/wishlistController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/add', authMiddleware, addToWishlist);

export default router;