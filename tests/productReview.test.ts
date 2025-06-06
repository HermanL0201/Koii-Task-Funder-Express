import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { ProductReview, calculateAggregateRating } from '../src/models/productReview';

describe('Product Review Aggregate Rating', () => {
  // Setup MongoDB memory server for testing
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/sephora_test');
  });

  afterEach(async () => {
    await ProductReview.deleteMany({});
    await mongoose.connection.close();
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