import { Request, Response } from 'express';
import { Wishlist } from '../models/Wishlist';
import { Product } from '../models/Product';

export class WishlistController {
  /**
   * Get the current user's wishlist with full product details
   * @param req Express request object
   * @param res Express response object
   */
  static async getWishlist(req: Request, res: Response) {
    try {
      // Assuming the authenticated user's ID is available in req.user
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ 
          message: 'Unauthorized: User ID not found' 
        });
      }

      // Find the wishlist and populate product details
      const wishlist = await Wishlist.findOne({ user: userId });

      if (!wishlist) {
        return res.status(404).json({ 
          message: 'Wishlist not found' 
        });
      }

      // Explicitly populate products
      const populatedWishlist = await wishlist.populate('products');

      res.status(200).json({
        wishlist: populatedWishlist.products
      });
    } catch (error) {
      console.error('Error retrieving wishlist:', error);
      res.status(500).json({ 
        message: 'Internal server error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}