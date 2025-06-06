import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Sephora API Application', () => {
  it('should return 200 OK for root route', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Sephora API is running' });
  });

  it('should return 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Route Not Found');
  });
});