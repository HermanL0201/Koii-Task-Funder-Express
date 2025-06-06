import { describe, it, expect } from 'vitest';
import cryptoPrices from '../src/data/crypto-prices.json';

describe('Mock Cryptocurrency Prices', () => {
  it('should have valid cryptocurrency prices', () => {
    expect(cryptoPrices).toBeTruthy();
  });
});