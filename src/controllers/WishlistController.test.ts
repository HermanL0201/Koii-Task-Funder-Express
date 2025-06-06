import { describe, it, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import { WishlistController } from './WishlistController';
import { Wishlist } from '../models/Wishlist';
import { Product } from '../models/Product';
import mongoose from 'mongoose';

describe('WishlistController', () => {
  const mockUser = { 
    id: new mongoose.Types.ObjectId() 
  };

  const mockProducts = [
    new Product({
      _id: new mongoose.Types.ObjectId(),
      name: 'Test Product 1',
      brand: 'Sephora',
      price: 29.99,
      description: 'A test product',
      imageUrl: 'https://example.com/product1.jpg'
    }),
    new Product({
      _id: new mongoose.Types.ObjectId(),
      name: 'Test Product 2',
      brand: 'Sephora',
      price: 39.99,
      description: 'Another test product',
      imageUrl: 'https://example.com/product2.jpg'
    })
  ];

  it('should retrieve user wishlist successfully', async () => {
    // Create a mock wishlist
    const mockWishlist = {
      user: mockUser.id,
      products: mockProducts.map(p => p._id),
      populate: vi.fn().mockResolvedValue({
        products: mockProducts
      })
    };

    // Spy on Wishlist.findOne and mock the result
    const findOneSpy = vi.spyOn(Wishlist, 'findOne').mockResolvedValue(mockWishlist as any);

    const mockReq = {
      user: mockUser,
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    await WishlistController.getWishlist(mockReq, mockRes);

    expect(findOneSpy).toHaveBeenCalledWith({ user: mockUser.id });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      wishlist: mockProducts
    });
  });

  it('should return 401 if no user ID is found', async () => {
    const mockReq = {
      user: null,
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    await WishlistController.getWishlist(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ 
      message: 'Unauthorized: User ID not found' 
    });
  });

  it('should return 404 if wishlist is not found', async () => {
    const findOneSpy = vi.spyOn(Wishlist, 'findOne').mockResolvedValue(null);

    const mockReq = {
      user: mockUser,
    } as Request;

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    await WishlistController.getWishlist(mockReq, mockRes);

    expect(findOneSpy).toHaveBeenCalledWith({ user: mockUser.id });
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ 
      message: 'Wishlist not found' 
    });
  });
});