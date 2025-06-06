import { Request, Response, NextFunction } from 'express';

// Helper function to validate coin identifier
const isValidCoinId = (id: string): boolean => {
  const coinIdRegex = /^[a-z0-9-]+$/i;
  return coinIdRegex.test(id);
};

// Validate coin price query parameters
export const validateCoinPriceParams = () => {
  const validators = [
    (req: Request, res: Response, next: NextFunction) => {
      const { ids, vs_currencies } = req.query;

      if (!ids || typeof ids !== 'string' || !isValidCoinId(ids)) {
        return res.status(400).json({ error: 'Invalid coin ID' });
      }

      if (!vs_currencies || typeof vs_currencies !== 'string') {
        return res.status(400).json({ error: 'Invalid currency' });
      }

      return next();
    }
  ];

  return validators;
};

// Validate coin list query parameters
export const validateCoinListParams = () => {
  const validators = [
    (req: Request, res: Response, next: NextFunction) => {
      const { include_platform } = req.query;

      // Optional parameter, so just validate if present
      if (include_platform && 
          typeof include_platform !== 'string' && 
          include_platform !== 'true' && 
          include_platform !== 'false') {
        return res.status(400).json({ error: 'Invalid include_platform value' });
      }

      return next();
    }
  ];

  return validators;
};

// Validate coin details query parameters
export const validateCoinDetailsParams = () => {
  const validators = [
    (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      if (!id || !isValidCoinId(id)) {
        return res.status(400).json({ error: 'Invalid coin ID' });
      }

      return next();
    }
  ];

  return validators;
};