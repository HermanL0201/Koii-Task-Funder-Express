import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/index';

describe('Cryptocurrency Price API', () => {
    it('should return price for supported cryptocurrency', async () => {
        const response = await request(app).get('/api/price/BTC');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('symbol');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('timestamp');
    });

    it('should return 400 for unsupported cryptocurrency', async () => {
        const response = await request(app).get('/api/price/UNSUPPORTED');
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('supportedSymbols');
    });
});