import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import request from 'supertest';
import express from 'express';
import coinDetailsRouter from './src/routes/coinDetails.js';

// Read crypto prices from JSON file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cryptoPricesPath = path.join(__dirname, 'src', 'data', 'crypto-prices.json');
const cryptoPrices = JSON.parse(readFileSync(cryptoPricesPath, 'utf8'));

// Test crypto prices data
describe('Cryptocurrency Prices', () => {
    it('should have valid cryptocurrency data', () => {
        const supportedCoins = ['bitcoin', 'ethereum', 'dogecoin', 'cardano'];
        
        supportedCoins.forEach(coin => {
            expect(cryptoPrices).toHaveProperty(coin);
        });
    });

    it('should have correct price data structure', () => {
        Object.values(cryptoPrices).forEach(coin => {
            expect(coin).toHaveProperty('id');
            expect(coin).toHaveProperty('symbol');
            expect(coin).toHaveProperty('name');
            expect(coin).toHaveProperty('current_price');
            expect(coin).toHaveProperty('market_cap');
            expect(coin).toHaveProperty('market_cap_rank');
            expect(coin).toHaveProperty('total_volume');
            expect(coin).toHaveProperty('price_change_percentage_24h');
        });
    });
});

// Test coin details route
const createTestApp = () => {
  const app = express();
  app.use('/coins', coinDetailsRouter);
  return app;
};

describe('Coin Details Endpoint', () => {
  it('should return coin details for valid coin', async () => {
    const app = createTestApp();
    const response = await request(app).get('/coins/bitcoin');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'bitcoin');
    expect(response.body).toHaveProperty('name', 'Bitcoin');
  });

  it('should return 404 for non-existent coin', async () => {
    const app = createTestApp();
    const response = await request(app).get('/coins/nonexistent');
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
    expect(response.body).toHaveProperty('message', 'Cryptocurrency not found');
  });
});