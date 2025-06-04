const axios = require('axios');

const SUPPORTED_SYMBOLS = ['BTC', 'ETH', 'XRP', 'LTC', 'ADA'];
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

/**
 * Fetch current price for a given cryptocurrency symbol
 * @param {string} symbol - Cryptocurrency symbol (e.g., 'BTC')
 * @returns {Promise<number>} Current price in USD
 * @throws {Error} If symbol is not supported or price retrieval fails
 */
async function fetchCryptoPrice(symbol) {
    // Validate input symbol
    const normalizedSymbol = symbol.toUpperCase();
    if (!SUPPORTED_SYMBOLS.includes(normalizedSymbol)) {
        throw new Error(`Unsupported cryptocurrency symbol: ${symbol}`);
    }

    try {
        const response = await axios.get(COINGECKO_API_URL, {
            params: {
                ids: normalizedSymbol.toLowerCase(),
                vs_currencies: 'usd'
            }
        });

        const price = response.data[normalizedSymbol.toLowerCase()]?.usd;
        
        if (price === undefined) {
            throw new Error(`Price not found for symbol: ${symbol}`);
        }

        return price;
    } catch (error) {
        console.error('Price retrieval error:', error.message);
        throw new Error(`Failed to retrieve price for ${symbol}`);
    }
}

module.exports = {
    fetchCryptoPrice,
    SUPPORTED_SYMBOLS
};