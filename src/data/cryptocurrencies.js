/**
 * Mock list of cryptocurrencies simulating CoinGecko's coin list
 * @type {Array<{id: string, symbol: string, name: string}>}
 */
export const cryptocurrencies = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 50000,
    market_cap: 950000000000,
    market_cap_rank: 1
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 3000,
    market_cap: 350000000000,
    market_cap_rank: 2
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    current_price: 1.5,
    market_cap: 50000000000,
    market_cap_rank: 3
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    current_price: 0.25,
    market_cap: 35000000000,
    market_cap_rank: 4
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'Binance Coin',
    current_price: 400,
    market_cap: 65000000000,
    market_cap_rank: 5
  }
];

/**
 * Retrieve the list of cryptocurrencies
 * @returns {Array<{id: string, symbol: string, name: string}>}
 */
export const getCryptocurrencies = () => {
  return cryptocurrencies;
};

/**
 * Find a cryptocurrency by its ID
 * @param {string} id - Cryptocurrency ID
 * @returns {Object|null} Cryptocurrency details or null if not found
 */
export const findCryptocurrencyById = (id) => {
  return cryptocurrencies.find(crypto => crypto.id === id.toLowerCase()) || null;
};