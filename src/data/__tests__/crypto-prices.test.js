import { describe, it, expect } from 'vitest';
import cryptoPrices from '../crypto-prices.json';

describe('Cryptocurrency Prices Mock Data', () => {
    const expectedCryptos = ['bitcoin', 'ethereum', 'cardano', 'dogecoin'];

    it('should have mock data for expected cryptocurrencies', () => {
        expectedCryptos.forEach(crypto => {
            expect(cryptoPrices).toHaveProperty(crypto);
        });
    });

    it('should have correct price data structure', () => {
        expectedCryptos.forEach(crypto => {
            const cryptoData = cryptoPrices[crypto];
            
            expect(cryptoData).toHaveProperty('id', crypto);
            expect(cryptoData).toHaveProperty('symbol');
            expect(cryptoData).toHaveProperty('name');
            expect(cryptoData).toHaveProperty('current_price');
            expect(cryptoData).toHaveProperty('market_cap');
            expect(cryptoData).toHaveProperty('market_cap_rank');
            expect(cryptoData).toHaveProperty('total_volume');
            expect(cryptoData).toHaveProperty('price_change_percentage_24h');
        });
    });

    it('should have valid price values', () => {
        expectedCryptos.forEach(crypto => {
            const cryptoData = cryptoPrices[crypto];
            
            expect(cryptoData.current_price).toBeGreaterThan(0);
            expect(cryptoData.market_cap).toBeGreaterThan(0);
            expect(cryptoData.total_volume).toBeGreaterThan(0);
        });
    });
});