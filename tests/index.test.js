import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import axios from 'axios';
import app from '../src/index';

describe('Cryptocurrency Price API', () => {
    beforeEach(() => {
        // Mock axios get method
        vi.spyOn(axios, 'get').mockResolvedValue({
            data: { 'btc': { usd: 30000 } }
        });
    });

    it('should return price for supported cryptocurrency', async () => {
        const response = await request(app).get('/api/price/BTC');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('symbol', 'BTC');
        expect(response.body).toHaveProperty('price', 30000);
        expect(response.body).toHaveProperty('timestamp');
    });

    it('should return 400 for unsupported cryptocurrency', async () => {
        const response = await request(app).get('/api/price/UNSUPPORTED');
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('supportedSymbols');
    });
});