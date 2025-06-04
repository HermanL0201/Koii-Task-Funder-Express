import { describe, it, expect } from 'vitest';
import cryptoPrices from '../src/data/mock-crypto-prices.json';

describe('Mock Cryptocurrency Prices', () => {
  it('should have Bitcoin and Ethereum prices', () => {
    expect(cryptoPrices.bitcoin).toBeDefined();
    expect(cryptoPrices.ethereum).toBeDefined();
    expect(cryptoPrices.bitcoin.usd).toBe(50000);
    expect(cryptoPrices.ethereum.usd).toBe(3000);
  });
});