const Joi = require('joi');

/**
 * Middleware to validate query parameters for coin list endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateCoinListQuery = (req, res, next) => {
  // Define validation schema
  const schema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    per_page: Joi.number().integer().min(1).max(250).optional(),
    order: Joi.string().valid('market_cap_desc', 'market_cap_asc', 'volume_desc', 'volume_asc').optional(),
    sparkline: Joi.boolean().optional()
  });

  // Validate query parameters
  const { error } = schema.validate(req.query, { abortEarly: false });

  // If validation fails, return detailed error response
  if (error) {
    const errorDetails = error.details.map(err => ({
      message: err.message,
      path: err.path
    }));

    return res.status(400).json({
      error: 'Invalid query parameters',
      details: errorDetails
    });
  }

  // If validation passes, proceed to next middleware
  next();
};

module.exports = validateCoinListQuery;