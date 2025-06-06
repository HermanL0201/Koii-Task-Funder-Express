import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import { Review } from '../src/models/Review';
import reviewRoutes from '../src/routes/reviewRoutes';

// Create an express app for testing
const app = express();
app.use(express.json());
app.use('/reviews', reviewRoutes);

describe('Review Routes', () => {
  // Setup: Connect to a test database before each test
  beforeEach(async () => {
    // Use an in-memory MongoDB for testing
    await mongoose.connect('mongodb://localhost:27017/sephora_test_db');
    
    // Clear the reviews collection before each test
    await Review.deleteMany({});
  });

  // Teardown: Close database connection after tests
  afterEach(async () => {
    await mongoose.connection.close();
  });

  it('should return 400 if no product ID is provided', async () => {
    const response = await request(app).get('/reviews/');
    expect(response.status).toBe(404); // Express returns 404 for undefined route
  });

  it('should return 404 if no reviews exist for a product', async () => {
    const response = await request(app).get('/reviews/non_existent_product');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No reviews found for this product');
  });

  it('should return reviews for a specific product', async () => {
    // Create some test reviews
    const productId = 'test_product_123';
    const reviewsData = [
      { productId, userId: 'user1', rating: 4, comment: 'Great product' },
      { productId, userId: 'user2', rating: 5, comment: 'Awesome!' }
    ];
    await Review.create(reviewsData);

    const response = await request(app).get(`/reviews/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.reviews).toHaveLength(2);
    expect(response.body.currentPage).toBe(1);
  });

  it('should support pagination', async () => {
    const productId = 'pagination_test';
    const reviewsData = Array(15).fill(null).map((_, index) => ({
      productId,
      userId: `user${index}`,
      rating: 4,
      comment: `Review ${index}`
    }));
    await Review.create(reviewsData);

    const response = await request(app).get(`/reviews/${productId}?page=2&limit=10`);
    expect(response.status).toBe(200);
    expect(response.body.reviews).toHaveLength(5);
    expect(response.body.currentPage).toBe(2);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.totalReviews).toBe(15);
  });
});