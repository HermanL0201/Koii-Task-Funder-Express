const request = require('supertest');
const app = require('../src/app');

describe('Error Handling', () => {
  // Test not found route
  test('should return 404 for non-existent route', async () => {
    const response = await request(app).get('/non-existent-route');
    
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      statusCode: 404,
      message: 'Not Found',
      details: expect.stringContaining('Cannot GET /non-existent-route')
    });
  });

  // Test method not allowed
  test('should return 405 for unsupported HTTP method', async () => {
    const response = await request(app).post('/');
    
    expect(response.status).toBe(405);
    expect(response.body).toEqual({
      status: 'error',
      statusCode: 405,
      message: 'Method Not Allowed',
      details: expect.stringContaining('POST method is not supported for /')
    });
  });
});