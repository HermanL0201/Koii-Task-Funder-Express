import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Review, IReview } from '../models/review.model';

describe('Review Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/sephora_test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const validUserId = new mongoose.Types.ObjectId();
  const validProductId = new mongoose.Types.ObjectId();

  it('should create a valid review', async () => {
    const validReviewData: Partial<IReview> = {
      userId: validUserId,
      productId: validProductId,
      rating: 4,
      reviewText: 'Great product! Highly recommend.'
    };

    const review = new Review(validReviewData);
    const savedReview = await review.save();

    expect(savedReview.userId).toEqual(validUserId);
    expect(savedReview.productId).toEqual(validProductId);
    expect(savedReview.rating).toBe(4);
    expect(savedReview.reviewText).toBe('Great product! Highly recommend.');
    expect(savedReview.createdAt).toBeDefined();
    expect(savedReview.updatedAt).toBeDefined();
  });

  it('should fail to create a review without userId', async () => {
    const invalidReviewData = {
      productId: validProductId,
      rating: 3
    };

    const review = new Review(invalidReviewData);
    
    await expect(review.save()).rejects.toThrow();
  });

  it('should fail to create a review with invalid rating', async () => {
    const invalidReviewData = {
      userId: validUserId,
      productId: validProductId,
      rating: 6
    };

    const review = new Review(invalidReviewData);
    
    await expect(review.save()).rejects.toThrow();
  });

  it('should prevent duplicate reviews for same user and product', async () => {
    const duplicateReviewData = {
      userId: validUserId,
      productId: validProductId,
      rating: 5,
      reviewText: 'Another review'
    };

    const review1 = new Review(duplicateReviewData);
    await review1.save();

    const review2 = new Review(duplicateReviewData);
    
    await expect(review2.save()).rejects.toThrow();
  });
});