const { describe, it, expect } = require('@jest/globals');
const cryptoPrices = require('../src/data/crypto-prices.json');

describe('Crypto Prices Mock Data', () => {
  it('should have valid cryptocurrency data', () => {
    expect(cryptoPrices).toBeDefined();
    expect(Object.keys(cryptoPrices).length).toBeGreaterThan(0);
  });

  it('should have price and symbol for each cryptocurrency', () => {
    Object.values(cryptoPrices).forEach(coin => {
      expect(coin).toHaveProperty('price');
      expect(coin).toHaveProperty('symbol');
    });
  });
});