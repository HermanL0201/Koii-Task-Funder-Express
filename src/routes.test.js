import { describe, it, expect } from 'vitest';
import { getCoins } from './routes.js';
import { coinsList } from './mockData.js';

describe('getCoins', () => {
  const createMockReqRes = (query = {}) => ({
    query,
    json: (data) => data,
    status: (code) => ({
      json: (data) => ({ status: code, data })
    })
  });

  it('should return all coins by default', () => {
    const req = createMockReqRes();
    const res = { json: (data) => data };
    
    const result = getCoins(req, res);
    expect(result).toHaveLength(coinsList.length);
  });

  it('should sort coins by name', () => {
    const req = createMockReqRes({ order: 'name' });
    const res = { json: (data) => data };
    
    const result = getCoins(req, res);
    expect(result[0].name).toBe('Bitcoin');
    expect(result[1].name).toBe('Cardano');
  });

  it('should limit results', () => {
    const req = createMockReqRes({ limit: 2 });
    const res = { json: (data) => data };
    
    const result = getCoins(req, res);
    expect(result).toHaveLength(2);
  });

  it('should filter by ids', () => {
    const req = createMockReqRes({ ids: ['bitcoin', 'ethereum'] });
    const res = { json: (data) => data };
    
    const result = getCoins(req, res);
    expect(result).toHaveLength(2);
    expect(result.some(coin => coin.id === 'bitcoin')).toBe(true);
    expect(result.some(coin => coin.id === 'ethereum')).toBe(true);
  });

  it('should handle invalid order parameter', () => {
    const req = createMockReqRes({ order: 'invalid' });
    const res = {
      status: (code) => ({
        json: (data) => ({ status: code, data })
      })
    };
    
    const result = getCoins(req, res);
    expect(result.status).toBe(400);
    expect(result.data.error).toContain('Invalid order parameter');
  });

  it('should handle invalid limit', () => {
    const req = createMockReqRes({ limit: -1 });
    const res = {
      status: (code) => ({
        json: (data) => ({ status: code, data })
      })
    };
    
    const result = getCoins(req, res);
    expect(result.status).toBe(400);
    expect(result.data.error).toContain('Limit must be a positive number');
  });
});