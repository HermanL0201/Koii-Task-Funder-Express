import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ProductReview, calculateAggregateRating } from '../src/models/productReview';

describe('Product Review Aggregate Rating', () => {
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

  it('should calculate aggregate rating correctly for a product', async () => {
    const productId = new mongoose.Types.ObjectId();
    const userId1 = new mongoose.Types.ObjectId();
    const userId2 = new mongoose.Types.ObjectId();

    // Create multiple reviews for the same product
    await ProductReview.create([
      { productId, userId: userId1, rating: 4 },
      { productId, userId: userId2, rating: 5 }
    ]);

    const result = await calculateAggregateRating(productId);

    expect(result).toEqual({
      averageRating: 4.5,
      totalReviews: 2
    });
  });

  it('should return zero for a product with no reviews', async () => {
    const productId = new mongoose.Types.ObjectId();

    const result = await calculateAggregateRating(productId);

    expect(result).toEqual({
      averageRating: 0,
      totalReviews: 0
    });
  });

  it('should throw an error if no product ID is provided', async () => {
    await expect(calculateAggregateRating(null as any)).rejects.toThrow('Product ID is required');
  });
});