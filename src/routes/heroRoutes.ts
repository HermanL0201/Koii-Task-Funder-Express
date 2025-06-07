import express from 'express';
import { getHeroByName } from '../controllers/heroController';

const router = express.Router();

/**
 * Dynamic hero route that retrieves hero information by name
 * Supports case-insensitive hero name matching
 */
router.get('/:heroName', (req, res) => {
  const { heroName } = req.params;
  
  try {
    const hero = getHeroByName(heroName);
    
    if (!hero) {
      return res.status(404).json({
        message: `Hero '${heroName}' not found`,
        status: 404
      });
    }
    
    res.json(hero);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    });
  }
});

export default router;