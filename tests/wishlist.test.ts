import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { WishlistItem } from '../src/models/Wishlist';

describe('Wishlist Functionality', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
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
});