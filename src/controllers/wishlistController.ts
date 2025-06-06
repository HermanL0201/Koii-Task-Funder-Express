import { Request, Response } from 'express';
import { Wishlist } from '../models/Wishlist';
import mongoose from 'mongoose';

export const removeProductFromWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id; // Assume user is authenticated and attached to req

    // Validate input
    if (!userId) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        message: 'Invalid product ID' 
      });
    }

    // Find and update the wishlist
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: new mongoose.Types.ObjectId(productId) } },
      { new: true }
    );

    // Check if wishlist exists
    if (!wishlist) {
      return res.status(404).json({ 
        message: 'Wishlist not found' 
      });
    }

    return res.status(200).json({
      message: 'Product removed from wishlist successfully',
      wishlist
    });

  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};