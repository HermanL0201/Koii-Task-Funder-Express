import { Request, Response, NextFunction } from 'express';

// Helper function to validate coin ID
const isValidCoinId = (id: string): boolean => {
  const validIdRegex = /^[a-z0-9-]+$/i;
  return validIdRegex.test(id);
};

// Coin Price Validation
export const validateCoinPriceParams = () => [
  (req: Request, res: Response, next: NextFunction) => {
    const { ids } = req.query;
    
    if (!ids || typeof ids !== 'string') {
      return res.status(400).json({ message: 'Invalid coin IDs' });
    }

    const coinIds = ids.split(',');
    const invalidIds = coinIds.filter(id => !isValidCoinId(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({ message: 'Invalid coin IDs', invalidIds });
    }

    next();
  }
];

// Coin List Validation
export const validateCoinListParams = () => [
  (req: Request, res: Response, next: NextFunction) => {
    const { include_platform } = req.query;
    
    if (include_platform && typeof include_platform !== 'string') {
      return res.status(400).json({ message: 'Invalid include_platform parameter' });
    }

    next();
  }
];

// Coin Details Validation
export const validateCoinDetailsParams = () => [
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    if (!id || !isValidCoinId(id)) {
      return res.status(400).json({ message: 'Invalid coin ID' });
    }

    next();
  }
];