import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';

describe('Mock Cryptocurrency Prices', () => {
    let cryptoPrices;

    beforeAll(async () => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const filePath = join(__dirname, '..', 'src', 'data', 'mock-crypto-prices.json');
        const fileContents = await readFile(filePath, 'utf8');
        cryptoPrices = JSON.parse(fileContents);
    });

    // Test that the mock data has the expected structure
    it('should have valid cryptocurrency data', () => {
        const supportedCoins = ['bitcoin', 'ethereum', 'dogecoin', 'cardano'];
        
        // Check if all expected coins are present
        supportedCoins.forEach(coin => {
            expect(cryptoPrices).toHaveProperty(coin);
        });
    });

    // Validate each cryptocurrency object
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
            expect(coin).toHaveProperty('last_updated');
        });
    });

    // Check that prices are valid numbers
    it('should have valid numeric price data', () => {
        Object.values(cryptoPrices).forEach(coin => {
            expect(typeof coin.current_price).toBe('number');
            expect(coin.current_price).toBeGreaterThan(0);
            
            expect(typeof coin.market_cap).toBe('number');
            expect(coin.market_cap).toBeGreaterThan(0);
            
            expect(typeof coin.total_volume).toBe('number');
            expect(coin.total_volume).toBeGreaterThan(0);
        });
    });
});