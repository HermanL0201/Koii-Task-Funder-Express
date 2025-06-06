import { describe, it, expect, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import User from '../src/models/User';

describe('User Model', () => {
  // Connect to a test database before each test
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/sephora_test');
  });

  // Clean up and disconnect after tests
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a new user with valid email and password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'validPassword123'
    };

    const user = new User(userData);
    await user.save();

    expect(user.email).toBe(userData.email.toLowerCase());
    expect(user.password).not.toBe(userData.password); // Should be hashed
  });

  it('should hash the password before saving', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'validPassword123'
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password);
  });

  it('should validate email format', async () => {
    const invalidEmails = ['invalid-email', 'invalid@', '@invalid.com'];

    for (const email of invalidEmails) {
      const user = new User({
        email,
        password: 'validPassword123'
      });

      await expect(user.validate()).rejects.toThrow();
    }
  });

  it('should compare passwords correctly', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'validPassword123'
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await user.comparePassword(userData.password);
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongPassword');
    expect(isNotMatch).toBe(false);
  });

  it('should require email and password', async () => {
    const userWithoutEmail = new User({ password: 'validPassword123' });
    const userWithoutPassword = new User({ email: 'test@example.com' });

    await expect(userWithoutEmail.validate()).rejects.toThrow();
    await expect(userWithoutPassword.validate()).rejects.toThrow();
  });

  it('should enforce unique email', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'validPassword123'
    };

    const user1 = new User(userData);
    await user1.save();

    const user2 = new User(userData);
    await expect(user2.save()).rejects.toThrow();
  });
});