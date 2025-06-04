import express from 'express';
import { getFilteredCoinsList } from '../data/coins.js';

const router = express.Router();

/**
 * GET /coins/list endpoint
 * Returns a list of coins with optional sorting and ordering
 * 
 * Query Parameters:
 * - order: Sort order (asc/desc, default: asc)
 * - sortBy: Field to sort by (id/symbol/name, default: id)
 */
router.get('/list', (req, res) => {
  try {
    const { order, sortBy } = req.query;

    // Validate order parameter
    if (order && !['asc', 'desc'].includes(order)) {
      return res.status(400).json({
        error: 'Invalid order parameter. Must be "asc" or "desc".'
      });
    }

    // Get filtered and sorted coin list
    const coinsList = getFilteredCoinsList({ order, sortBy });

    res.json(coinsList);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

export default router;