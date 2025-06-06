import { describe, it, expect } from 'vitest';
import cryptoPrices from '../src/data/crypto-prices.json';

describe('Mock Cryptocurrency Prices', () => {
  it('should have valid cryptocurrency prices', () => {
    expect(cryptoPrices).toBeTruthy();
    expect(Object.keys(cryptoPrices).length).toBeGreaterThan(0);
  });

  it('should have each cryptocurrency with valid price', () => {
    Object.entries(cryptoPrices).forEach(([coin, priceInfo]) => {
      expect(coin).toBeTruthy();
      expect(priceInfo.usd).toBeGreaterThanOrEqual(0);
    });
  });

  it('should match the expected price data structure', () => {
    Object.values(cryptoPrices).forEach(priceInfo => {
      expect(priceInfo).toHaveProperty('usd');
      expect(typeof priceInfo.usd).toBe('number');
    });
  });
});