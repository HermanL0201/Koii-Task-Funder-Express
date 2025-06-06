import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

/**
 * Sanitization and validation rules for search queries
 */
export const searchValidationRules = [
  // Validate and sanitize search query
  query('q')
    .optional()
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),

  // Validate category (if provided)
  query('category')
    .optional()
    .trim()
    .escape()
    .isIn(['makeup', 'skincare', 'haircare', 'fragrance'])
    .withMessage('Invalid category'),

  // Validate price range 
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number')
    .custom((value, { req }) => {
      if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
        throw new Error('Maximum price must be greater than or equal to minimum price');
      }
      return true;
    }),

  // Validate pagination parameters
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Middleware to handle validation errors
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Combine validation rules and error handler
export const searchQueryValidation = [
  ...searchValidationRules,
  validateSearchQuery
];