import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('Express App', () => {
  it('should respond to root route', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hero API is running' });
  });
});