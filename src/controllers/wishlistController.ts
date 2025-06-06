import { Request, Response } from 'express';
import { WishlistItem } from '../models/Wishlist';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const addToWishlist = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.id;

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Check if item already exists in wishlist
    const existingItem = await WishlistItem.findOne({ 
      user: userId, 
      product: productId 
    });

    if (existingItem) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    // Create new wishlist item
    const wishlistItem = new WishlistItem({
      user: userId,
      product: productId
    });

    await wishlistItem.save();

    res.status(201).json({
      message: 'Product added to wishlist',
      wishlistItem
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};