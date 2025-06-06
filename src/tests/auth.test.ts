import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { UserModel } from '../models/User';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateToken } from '../utils/authUtils';

// Mock mongoose's methods for testing
vi.mock('../models/User', () => ({
  UserModel: {
    create: vi.fn(),
    deleteMany: vi.fn(),
    findOne: vi.fn(),
  }
}));

describe('Authentication API', () => {
  // Test data
  const validUser = {
    email: 'test@sephora.com',
    password: 'StrongPassword123!',
    firstName: 'Test',
    lastName: 'User'
  };

  // Clear database before each test
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  // Registration Tests
  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      // Mock the create method to return the user
      (UserModel.create as any).mockResolvedValue({
        ...validUser,
        _id: 'mock-user-id'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(validUser.email);
    });

    it('should reject registration with existing email', async () => {
      // Mock findOne to return an existing user
      (UserModel.findOne as any).mockResolvedValue({
        ...validUser,
        _id: 'existing-user-id'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Login Tests
  describe('User Login', () => {
    beforeEach(async () => {
      // Mock findOne to return a user with hashed password
      const hashedPassword = await hashPassword(validUser.password);
      (UserModel.findOne as any).mockResolvedValue({
        ...validUser,
        _id: 'mock-user-id',
        password: hashedPassword
      });
    });

    it('should successfully login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUser.email,
          password: validUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUser.email,
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Password Utility Tests
  describe('Password Utilities', () => {
    it('should hash and compare password correctly', async () => {
      const plainPassword = 'TestPassword123!';
      const hashedPassword = await hashPassword(plainPassword);

      // Check that hashed password is different from plain password
      expect(hashedPassword).not.toBe(plainPassword);

      // Verify password comparison works
      const isMatch = await comparePassword(plainPassword, hashedPassword);
      expect(isMatch).toBe(true);
    });

    it('should fail password comparison for incorrect password', async () => {
      const plainPassword = 'TestPassword123!';
      const hashedPassword = await hashPassword(plainPassword);

      const isMatch = await comparePassword('WrongPassword', hashedPassword);
      expect(isMatch).toBe(false);
    });
  });

  // Token Generation Tests
  describe('Token Generation', () => {
    it('should generate a valid JWT token', async () => {
      const user = {
        ...validUser,
        _id: 'mock-user-id'
      };
      const token = generateToken(user as any);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });
  });
});