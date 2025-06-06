import { Request, Response, NextFunction } from 'express';
import { ProductValidationError } from '../types/errors';

/**
 * Validates coin-related inputs across different endpoints
 */
class InputValidator {
  /**
   * Validates a coin identifier
   * @param id Coin identifier to validate
   * @returns Boolean indicating if the ID is valid
   */
  private static isValidCoinId(id: string): boolean {
    const coinIdRegex = /^[a-z0-9-]+$/i;
    return coinIdRegex.test(id);
  }

  /**
   * Validates coin price query parameters
   * @param req Express request object
   * @param res Express response object
   * @param next Next middleware function
   */
  static validateCoinPriceParams(req: Request, res: Response, next: NextFunction): void {
    const { ids, vs_currencies } = req.query;

    if (!ids || typeof ids !== 'string' || !this.isValidCoinId(ids)) {
      throw new ProductValidationError('Invalid coin ID');
    }

    if (!vs_currencies || typeof vs_currencies !== 'string') {
      throw new ProductValidationError('Invalid currency');
    }

    next();
  }

  /**
   * Validates coin list query parameters
   * @param req Express request object
   * @param res Express response object
   * @param next Next middleware function
   */
  static validateCoinListParams(req: Request, res: Response, next: NextFunction): void {
    const { include_platform } = req.query;

    // Optional parameter validation
    if (include_platform && 
        typeof include_platform !== 'string' && 
        include_platform !== 'true' && 
        include_platform !== 'false') {
      throw new ProductValidationError('Invalid include_platform value');
    }

    next();
  }

  /**
   * Validates coin details route parameters
   * @param req Express request object
   * @param res Express response object
   * @param next Next middleware function
   */
  static validateCoinDetailsParams(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    if (!id || !this.isValidCoinId(id)) {
      throw new ProductValidationError('Invalid coin ID');
    }

    next();
  }
}

// Export middleware functions for route usage
export const validateCoinPriceParams = () => [InputValidator.validateCoinPriceParams];
export const validateCoinListParams = () => [InputValidator.validateCoinListParams];
export const validateCoinDetailsParams = () => [InputValidator.validateCoinDetailsParams];