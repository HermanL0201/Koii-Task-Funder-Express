import { coinsList } from '../data/coinsList.js';

/**
 * Handles GET request for cryptocurrency list
 * Supports optional query parameters:
 * - order: 'asc' or 'desc' for sorting
 * - filter: keyword to filter coins by name or symbol
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {void}
 */
export const getCoinsListHandler = (req, res) => {
  try {
    let result = [...coinsList];
    const { order, filter } = req.query;

    // Filter coins if filter query is provided
    if (filter) {
      const filterLower = String(filter).toLowerCase();
      result = result.filter(coin => 
        coin.name.toLowerCase().includes(filterLower) || 
        coin.symbol.toLowerCase().includes(filterLower)
      );
    }

    // Sort coins if order query is provided
    if (order === 'asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Unable to retrieve coins list' 
    });
  }
};