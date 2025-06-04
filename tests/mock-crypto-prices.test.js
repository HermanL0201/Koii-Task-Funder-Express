import { describe, it, expect } from 'vitest';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

describe('Mock Cryptocurrency Prices', () => {
    let cryptoPrices;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = join(__dirname, '..', 'src', 'data', 'mock-crypto-prices.json');

    // Test that the mock data has the expected structure
    it('should load and have valid cryptocurrency data', async () => {
        const fileContents = await readFile(filePath, 'utf8');
        cryptoPrices = JSON.parse(fileContents);

        const supportedCoins = ['bitcoin', 'ethereum', 'dogecoin', 'cardano'];
        
        // Check if all expected coins are present
        supportedCoins.forEach(coin => {
            expect(cryptoPrices).toHaveProperty(coin);
        });
    });

    // Validate each cryptocurrency object
    it('should have correct price data structure', async () => {
        const fileContents = await readFile(filePath, 'utf8');
        cryptoPrices = JSON.parse(fileContents);

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
    it('should have valid numeric price data', async () => {
        const fileContents = await readFile(filePath, 'utf8');
        cryptoPrices = JSON.parse(fileContents);

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