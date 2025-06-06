import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { WishlistItem } from '../src/models/Wishlist';

describe('Wishlist Functionality', () => {
  beforeEach(async () => {
    // Connect to a test database
    await mongoose.connect('mongodb://localhost:27017/sephora_test_db');
    // Clear wishlist items before each test
    await WishlistItem.deleteMany({});
  });

  it('should create a new wishlist item', async () => {
    const userId = new mongoose.Types.ObjectId();
    const productId = new mongoose.Types.ObjectId();

    const wishlistItem = new WishlistItem({
      user: userId,
      product: productId
    });

    const savedItem = await wishlistItem.save();

    expect(savedItem).toBeTruthy();
    expect(savedItem.user).toEqual(userId);
    expect(savedItem.product).toEqual(productId);
  });

  it('should prevent duplicate wishlist items', async () => {
    const userId = new mongoose.Types.ObjectId();
    const productId = new mongoose.Types.ObjectId();

    // Add first wishlist item
    await new WishlistItem({ user: userId, product: productId }).save();

    // Try to add same item again
    await expect(async () => {
      await new WishlistItem({ user: userId, product: productId }).save();
    }).rejects.toThrow();
  });

  afterEach(async () => {
    // Disconnect from test database
    await mongoose.connection.close();
  });
});