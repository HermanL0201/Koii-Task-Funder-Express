import { describe, it, expect, vi } from 'vitest';
import { removeProductFromWishlist } from '../controllers/wishlistController';
import { Wishlist } from '../models/Wishlist';
import mongoose from 'mongoose';

describe('Wishlist Controller - Remove Product', () => {
  it('should successfully remove a product from wishlist', async () => {
    const mockProductId = new mongoose.Types.ObjectId();
    const mockUserId = new mongoose.Types.ObjectId();
    
    const mockRequest: any = {
      params: { productId: mockProductId.toString() },
      user: { id: mockUserId.toString() }
    };

    const mockResponse: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    const mockWishlist = {
      userId: mockUserId,
      products: [mockProductId]
    };

    vi.spyOn(Wishlist, 'findOneAndUpdate').mockResolvedValue(mockWishlist as any);

    await removeProductFromWishlist(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Product removed from wishlist successfully'
      })
    );
  });

  it('should return 400 for invalid product ID', async () => {
    const mockRequest: any = {
      params: { productId: 'invalid-id' },
      user: { id: new mongoose.Types.ObjectId().toString() }
    };

    const mockResponse: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await removeProductFromWishlist(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid product ID'
    });
  });

  it('should return 401 if no user is authenticated', async () => {
    const mockRequest: any = {
      params: { productId: new mongoose.Types.ObjectId().toString() },
      user: null
    };

    const mockResponse: any = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await removeProductFromWishlist(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Authentication required'
    });
  });
});