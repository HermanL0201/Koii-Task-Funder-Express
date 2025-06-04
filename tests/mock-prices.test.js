import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadMockPrices() {
  const filePath = path.resolve(__dirname, '../src/data/mock-crypto-prices.json');
  const fileContent = await readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

describe('Mock Cryptocurrency Prices', () => {
  let mockPrices;

  beforeAll(async () => {
    mockPrices = await loadMockPrices();
  });

  // Test overall structure
  it('should have valid cryptocurrencies', () => {
    const expectedCoins = ['bitcoin', 'ethereum', 'ripple', 'cardano', 'dogecoin'];
    expectedCoins.forEach(coin => {
      expect(mockPrices).toHaveProperty(coin);
    });
  });

  // Test price validation
  it('should have valid price structures', () => {
    Object.values(mockPrices).forEach(coinData => {
      // Check required price keys
      expect(coinData).toHaveProperty('usd');
      expect(coinData).toHaveProperty('eur');
      expect(coinData).toHaveProperty('jpy');
      
      // Ensure prices are positive numbers
      expect(typeof coinData.usd).toBe('number');
      expect(coinData.usd).toBeGreaterThan(0);
    });
  });

  // Test market change and market cap
  it('should have valid 24h change and market cap', () => {
    Object.values(mockPrices).forEach(coinData => {
      expect(coinData).toHaveProperty('24h_change');
      expect(coinData).toHaveProperty('market_cap');
      
      // Market cap should be a positive number
      expect(typeof coinData.market_cap).toBe('number');
      expect(coinData.market_cap).toBeGreaterThan(0);
    });
  });

  // Test specific coin validations
  it('bitcoin should have realistic price and market cap', () => {
    const bitcoin = mockPrices.bitcoin;
    expect(bitcoin.usd).toBeGreaterThan(20000);
    expect(bitcoin.usd).toBeLessThan(80000);
    expect(bitcoin.market_cap).toBeGreaterThan(500000000000);
  });
});