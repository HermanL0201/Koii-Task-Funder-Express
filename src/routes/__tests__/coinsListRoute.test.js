import { describe, it, expect, vi } from 'vitest';
import { getCoinsListHandler } from '../coinsListRoute.js';

describe('getCoinsListHandler', () => {
  it('should return all coins when no query params are provided', () => {
    const mockReq = { query: {} };
    const mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };

    getCoinsListHandler(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ id: 'bitcoin', name: 'Bitcoin' })
    ]));
    expect(mockRes.json.mock.calls[0][0]).toHaveLength(10);
  });

  it('should filter coins when filter query is provided', () => {
    const mockReq = { query: { filter: 'bit' } };
    const mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };

    getCoinsListHandler(mockReq, mockRes);

    const resultCoins = mockRes.json.mock.calls[0][0];
    expect(resultCoins).toHaveLength(1);
    expect(resultCoins[0].id).toBe('bitcoin');
  });

  it('should sort coins in ascending order', () => {
    const mockReq = { query: { order: 'asc' } };
    const mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };

    getCoinsListHandler(mockReq, mockRes);

    const resultCoins = mockRes.json.mock.calls[0][0];
    expect(resultCoins[0].name).toBe('Bitcoin');
    expect(resultCoins[resultCoins.length - 1].name).toBe('Tether');
  });

  it('should sort coins in descending order', () => {
    const mockReq = { query: { order: 'desc' } };
    const mockRes = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };

    getCoinsListHandler(mockReq, mockRes);

    const resultCoins = mockRes.json.mock.calls[0][0];
    expect(resultCoins[0].name).toBe('Tether');
    expect(resultCoins[resultCoins.length - 1].name).toBe('Bitcoin');
  });
});