import { coinsList } from './mockData.js';

/**
 * Get coins list with optional sorting and filtering
 * @param {Object} req Express request object
 * @param {Object} res Express response object
 */
export const getCoins = (req, res) => {
  const { order = 'id', limit, ids } = req.query;

  // Validate order parameter
  const validOrders = ['id', 'symbol', 'name'];
  if (!validOrders.includes(order)) {
    return res.status(400).json({
      error: 'Invalid order parameter. Must be one of: id, symbol, name'
    });
  }

  // Apply sorting
  let filteredCoins = [...coinsList].sort((a, b) => 
    a[order].localeCompare(b[order])
  );

  // Apply ID filtering if provided
  if (ids) {
    const idList = Array.isArray(ids) ? ids : [ids];
    filteredCoins = filteredCoins.filter(coin => 
      idList.includes(coin.id)
    );
  }

  // Apply limit if provided
  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({
        error: 'Limit must be a positive number'
      });
    }
    filteredCoins = filteredCoins.slice(0, parsedLimit);
  }

  return res.json(filteredCoins);
};