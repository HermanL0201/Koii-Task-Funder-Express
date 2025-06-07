import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/config/server';

describe('Server Configuration', () => {
  const app = createServer();

  it('should return 200 OK for health check', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'OK',
      message: 'Hero API is running'
    });
  });

  it('should use JSON middleware', async () => {
    const testObject = { test: 'data' };
    const response = await request(app)
      .post('/test')
      .send(testObject)
      .expect('Content-Type', /json/);
    
    expect(response.status).toBe(404); // Not found, but should support JSON
  });
});