import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../src/models/User';
import authRoutes from '../src/routes/authRoutes';

describe('Authentication Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);

  beforeAll(async () => {
    // Setup in-memory MongoDB connection
    await mongoose.connect('mongodb://localhost:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should login user with valid credentials', async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword
    });
    await testUser.save();

    // Send login request
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should reject login with invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'somepassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should reject login with incorrect password', async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword
    });
    await testUser.save();

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
});