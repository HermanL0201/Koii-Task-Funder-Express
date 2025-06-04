const request = require('supertest');
const app = require('../index');

describe('Error Handling Middleware', () => {
  // Not Found Endpoint Test
  test('should return 404 for non-existent endpoints', async () => {
    const response = await request(app).get('/nonexistent-endpoint');
    
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('/nonexistent-endpoint');
    expect(response.body).toHaveProperty('available_endpoints');
  });

  // Method Not Allowed Test
  test('should return 405 for unsupported HTTP methods', async () => {
    const response = await request(app).post('/coins/markets');
    
    expect(response.statusCode).toBe(405);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Method POST not allowed');
    expect(response.body).toHaveProperty('allowed_methods');
  });
});