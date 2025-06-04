import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface CryptoPriceParams {
  ids: string[];
  vs_currencies: string[];
  include_24hr_change?: boolean;
}

export class CoinGekkoClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = 'https://api.coingecko.com/api/v3') {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000, // 10 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch current cryptocurrency prices
   * @param params - Parameters for price fetching
   * @returns Promise with cryptocurrency prices
   */
  async getCurrentPrices(params: CryptoPriceParams): Promise<Record<string, Record<string, number>>> {
    if (!params.ids || params.ids.length === 0) {
      throw new Error('At least one cryptocurrency ID is required');
    }

    if (!params.vs_currencies || params.vs_currencies.length === 0) {
      throw new Error('At least one target currency is required');
    }

    try {
      const response: AxiosResponse = await this.axiosInstance.get('/simple/price', {
        params: {
          ids: params.ids.join(','),
          vs_currencies: params.vs_currencies.join(','),
          include_24hr_change: params.include_24hr_change || false,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch prices: ${error.message}`);
      }
      throw error;
    }
  }
}

export default CoinGekkoClient;