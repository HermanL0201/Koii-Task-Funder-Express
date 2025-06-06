import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import reviewRoutes from './reviewRoutes';
import Review from '../models/Review';

const app = express();
app.use(express.json());
app.use(reviewRoutes);

const mockUserId = 'user123';
const generateToken = () => jwt.sign({ id: mockUserId }, process.env.JWT_SECRET || 'default_secret');

describe('Review Routes', () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/testdb');
  });

  afterEach(async () => {
    await Review.deleteMany({});
    await mongoose.connection.close();
  });

  it('should submit a valid review', async () => {
    const token = generateToken();
    const response = await request(app)
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: 'product123',
        rating: 4,
        comment: 'Great product!'
      });

    expect(response.status).toBe(201);
    expect(response.body.review).toBeDefined();
    expect(response.body.review.rating).toBe(4);
  });

  it('should prevent duplicate reviews', async () => {
    const token = generateToken();
    const productId = 'product456';

    // First submission
    await request(app)
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        rating: 5,
        comment: 'First review'
      });

    // Duplicate submission
    const response = await request(app)
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        rating: 3,
        comment: 'Second review'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('You have already reviewed this product');
  });

  it('should reject invalid ratings', async () => {
    const token = generateToken();
    const response = await request(app)
      .post('/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: 'product789',
        rating: 6,
        comment: 'Invalid rating'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Rating must be between 1 and 5');
  });
});