import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../app'; // Assuming main app file
import { UserModel } from '../models/User'; // User model
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateToken } from '../utils/authUtils';

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
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(validUser.email);
    });

    it('should reject registration with existing email', async () => {
      // First, register the user
      await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // Try registering again with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject registration with invalid email', async () => {
      const invalidUser = { ...validUser, email: 'invalid-email' };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject registration with weak password', async () => {
      const weakUser = { ...validUser, password: 'weak' };

      const response = await request(app)
        .post('/api/auth/register')
        .send(weakUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Login Tests
  describe('User Login', () => {
    beforeEach(async () => {
      // Pre-register a user for login tests
      const hashedPassword = await hashPassword(validUser.password);
      await UserModel.create({
        ...validUser,
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

    it('should reject login for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@sephora.com',
          password: 'SomePassword123!'
        });

      expect(response.status).toBe(404);
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
      const user = await UserModel.create(validUser);
      const token = generateToken(user);

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });
  });
});