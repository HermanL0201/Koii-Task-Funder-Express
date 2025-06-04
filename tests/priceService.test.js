import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { fetchCryptoPrice, SUPPORTED_SYMBOLS } from '../src/priceService';

describe('Price Service', () => {
    it('should fetch price for supported cryptocurrency', async () => {
        // Mock axios get method with slightly modified response
        vi.spyOn(axios, 'get').mockResolvedValue({
            data: { 'btc': { usd: 30000 } }
        });

        const price = await fetchCryptoPrice('BTC');
        expect(price).toBe(30000);
    });

    it('should throw error for unsupported cryptocurrency', async () => {
        await expect(fetchCryptoPrice('UNSUPPORTED'))
            .rejects.toThrow('Unsupported cryptocurrency symbol');
    });

    it('should validate supported symbols', () => {
        expect(SUPPORTED_SYMBOLS).toEqual(['BTC', 'ETH', 'XRP', 'LTC', 'ADA']);
    });
});