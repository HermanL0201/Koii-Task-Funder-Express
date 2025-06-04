import { describe, it, expect } from 'vitest';

const cryptoPrices = {
    bitcoin: {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        current_price: 50000.50,
        market_cap: 950000000000,
        market_cap_rank: 1,
        total_volume: 25000000000,
        price_change_percentage_24h: 2.5,
        last_updated: "2023-09-15T10:30:00Z"
    },
    ethereum: {
        id: "ethereum", 
        symbol: "eth",
        name: "Ethereum",
        current_price: 3200.75,
        market_cap: 380000000000,
        market_cap_rank: 2,
        total_volume: 15000000000,
        price_change_percentage_24h: 1.8,
        last_updated: "2023-09-15T10:30:00Z"
    },
    dogecoin: {
        id: "dogecoin",
        symbol: "doge", 
        name: "Dogecoin",
        current_price: 0.25,
        market_cap: 35000000000,
        market_cap_rank: 10,
        total_volume: 2000000000,
        price_change_percentage_24h: 3.2,
        last_updated: "2023-09-15T10:30:00Z"
    },
    cardano: {
        id: "cardano",
        symbol: "ada",
        name: "Cardano", 
        current_price: 0.45,
        market_cap: 25000000000,
        market_cap_rank: 15,
        total_volume: 1500000000,
        price_change_percentage_24h: 1.5,
        last_updated: "2023-09-15T10:30:00Z"
    }
};

describe('Mock Cryptocurrency Prices', () => {
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