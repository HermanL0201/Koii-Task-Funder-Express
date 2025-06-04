import { describe, it, expect } from 'vitest';
import cryptoPrices from '../src/mockData/cryptoPrices.json';

describe('Cryptocurrency Mock Price Data', () => {
    const requiredFields = [
        'id', 
        'symbol', 
        'name', 
        'current_price', 
        'market_cap', 
        'market_cap_rank', 
        'total_volume', 
        'price_change_percentage_24h'
    ];

    it('should have correct top cryptocurrencies', () => {
        const expectedCoins = ['bitcoin', 'ethereum', 'dogecoin', 'cardano', 'solana'];
        expect(Object.keys(cryptoPrices)).to.deep.equal(expectedCoins);
    });

    it('should have all required fields for each cryptocurrency', () => {
        Object.values(cryptoPrices).forEach(coin => {
            requiredFields.forEach(field => {
                expect(coin).to.have.property(field);
            });
        });
    });

    it('should have valid price data', () => {
        Object.values(cryptoPrices).forEach(coin => {
            expect(coin.current_price).to.be.a('number');
            expect(coin.current_price).to.be.greaterThan(0);
            expect(coin.market_cap).to.be.a('number');
            expect(coin.market_cap).to.be.greaterThan(0);
        });
    });
});