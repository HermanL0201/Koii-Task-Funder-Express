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

  it('should support JSON parsing', async () => {
    const testObject = { test: 'data' };
    
    app.post('/test', (req, res) => {
      res.json(req.body);
    });

    const response = await request(app)
      .post('/test')
      .send(testObject)
      .expect('Content-Type', /json/);
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(testObject);
  });
});