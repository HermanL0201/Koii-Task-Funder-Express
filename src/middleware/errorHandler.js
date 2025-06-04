/**
 * Error handling middleware for managing not found and invalid routes
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
function notFoundHandler(req, res, next) {
  // Create a detailed not found error response
  const error = {
    status: 'error',
    statusCode: 404,
    message: 'Not Found',
    details: `Cannot ${req.method} ${req.originalUrl}`
  };

  // Log the not found route for debugging
  console.warn(`Not Found: ${req.method} ${req.originalUrl}`);

  // Send a JSON response with 404 status
  res.status(404).json(error);
}

/**
 * Handles method not allowed errors
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
function methodNotAllowedHandler(req, res, next) {
  // Create a detailed method not allowed error response
  const error = {
    status: 'error',
    statusCode: 405,
    message: 'Method Not Allowed',
    details: `${req.method} method is not supported for ${req.originalUrl}`
  };

  // Log the unsupported method for debugging
  console.warn(`Method Not Allowed: ${req.method} ${req.originalUrl}`);

  // Send a JSON response with 405 status
  res.status(405).json(error);
}

module.exports = {
  notFoundHandler,
  methodNotAllowedHandler
};