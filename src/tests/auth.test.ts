import request from 'supertest';
import { app } from '../app';
import { UserModel } from '../models/User';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateToken } from '../utils/authUtils';

describe('Authentication Tests', () => {
  let testUser: any;

  beforeEach(async () => {
    // Setup test user
    testUser = new UserModel({
      username: 'testuser',
      password: await hashPassword('testpassword')
    });
    await testUser.save();
  });

  afterEach(async () => {
    // Clean up test user
    await UserModel.deleteMany({});
  });

  it('should authenticate a valid user', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
  });
});