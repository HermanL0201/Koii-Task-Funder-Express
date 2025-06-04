import { describe, it, expect } from 'vitest';
import { cryptocurrencies, getCryptocurrencies, findCryptocurrencyById } from '../src/data/cryptocurrencies.js';

describe('Cryptocurrency Mock Data', () => {
  it('should have valid cryptocurrency list', () => {
    expect(cryptocurrencies).toBeInstanceOf(Array);
    expect(cryptocurrencies.length).toBeGreaterThan(0);
  });

  it('should have correct cryptocurrency structure', () => {
    cryptocurrencies.forEach(crypto => {
      expect(crypto).toHaveProperty('id');
      expect(crypto).toHaveProperty('symbol');
      expect(crypto).toHaveProperty('name');
      expect(crypto).toHaveProperty('current_price');
      expect(crypto).toHaveProperty('market_cap');
      expect(crypto).toHaveProperty('market_cap_rank');
    });
  });

  it('getCryptocurrencies() should return the full list', () => {
    const list = getCryptocurrencies();
    expect(list).toEqual(cryptocurrencies);
  });

  it('findCryptocurrencyById() should find existing cryptocurrencies', () => {
    const bitcoin = findCryptocurrencyById('bitcoin');
    expect(bitcoin).toBeTruthy();
    expect(bitcoin.id).toBe('bitcoin');

    const ethereum = findCryptocurrencyById('Ethereum');
    expect(ethereum).toBeTruthy();
    expect(ethereum.id).toBe('ethereum');
  });

  it('findCryptocurrencyById() should return null for non-existent cryptocurrencies', () => {
    const nonExistent = findCryptocurrencyById('non_existent_coin');
    expect(nonExistent).toBeNull();
  });
});