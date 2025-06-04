const request = require('supertest');
const app = require('../index');

describe('Crypto Prices API', () => {
  test('should return coin markets with valid query params', async () => {
    const response = await request(app)
      .get('/coins/markets')
      .query({ vs_currency: 'usd', ids: 'bitcoin,ethereum' });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Check that result includes expected coins
    const coinIds = response.body.map(coin => coin.id);
    expect(coinIds).toContain('bitcoin');
    expect(coinIds).toContain('ethereum');
  });

  test('should return 400 when vs_currency is missing', async () => {
    const response = await request(app)
      .get('/coins/markets');

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required parameter: vs_currency');
  });
});