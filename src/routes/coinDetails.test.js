import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import coinDetailsRouter from './coinDetails';

// Create a test Express app
const createTestApp = () => {
  const app = express();
  app.use('/coins', coinDetailsRouter);
  return app;
};

describe('Coin Details Endpoint', () => {
  // Test successful coin retrieval
  it('should return coin details for valid coin', async () => {
    const app = createTestApp();
    const response = await request(app).get('/coins/bitcoin');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'bitcoin');
    expect(response.body).toHaveProperty('name', 'Bitcoin');
  });

  // Test non-existent coin
  it('should return 404 for non-existent coin', async () => {
    const app = createTestApp();
    const response = await request(app).get('/coins/dogecoin');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
    expect(response.body).toHaveProperty('message', 'Cryptocurrency not found');
  });

  // Test empty coin ID 
  it('should return 404 for empty coin ID', async () => {
    const app = createTestApp();
    const response = await request(app).get('/coins/');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
    expect(response.body).toHaveProperty('message', 'Coin ID is required');
  });

  // Test case insensitivity
  it('should return coin details with case-insensitive ID', async () => {
    const app = createTestApp();
    const response = await request(app).get('/coins/BITCOIN');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'bitcoin');
  });
});