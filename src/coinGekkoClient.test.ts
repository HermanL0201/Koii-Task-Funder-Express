import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import CoinGekkoClient from './coinGekkoClient';

// Mock the entire axios module
vi.mock('axios', () => ({
  default: {
    create: vi.fn().mockReturnValue({
      get: vi.fn()
    }),
    isAxiosError: vi.fn()
  }
}));

describe('CoinGekkoClient', () => {
  it('should create an instance with default base URL', () => {
    const client = new CoinGekkoClient();
    expect(client).toBeTruthy();
  });

  it('should throw error if no cryptocurrency IDs provided', async () => {
    const client = new CoinGekkoClient();
    
    await expect(client.getCurrentPrices({
      ids: [],
      vs_currencies: ['usd']
    })).rejects.toThrow('At least one cryptocurrency ID is required');
  });

  it('should throw error if no target currencies provided', async () => {
    const client = new CoinGekkoClient();
    
    await expect(client.getCurrentPrices({
      ids: ['bitcoin'],
      vs_currencies: []
    })).rejects.toThrow('At least one target currency is required');
  });

  it('should fetch current prices successfully', async () => {
    const mockResponse = {
      data: {
        bitcoin: { usd: 50000, usd_24h_change: 2.5 }
      }
    };

    // @ts-ignore
    axios.create().get.mockResolvedValue(mockResponse);

    const client = new CoinGekkoClient();
    const prices = await client.getCurrentPrices({
      ids: ['bitcoin'],
      vs_currencies: ['usd'],
      include_24hr_change: true
    });

    expect(prices).toEqual(mockResponse.data);
  });

  it('should handle API errors', async () => {
    // @ts-ignore
    axios.create().get.mockRejectedValue(new Error('Network Error'));
    // @ts-ignore
    axios.isAxiosError.mockReturnValue(true);

    const client = new CoinGekkoClient();
    
    await expect(client.getCurrentPrices({
      ids: ['bitcoin'],
      vs_currencies: ['usd']
    })).rejects.toThrow('Failed to fetch prices');
  });
});