import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index';

describe('Hero API', () => {
  it('should return a welcome message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hero API is running!' });
  });
});