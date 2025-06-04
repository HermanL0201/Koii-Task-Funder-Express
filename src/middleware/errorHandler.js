/**
 * Not Found Handler middleware
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const notFoundHandler = (req, res) => {
  const error = {
    status: 'error',
    statusCode: 404,
    message: 'Not Found',
    details: `Cannot ${req.method} ${req.originalUrl}`
  };

  res.status(404).json(error);
};

/**
 * Method Not Allowed Handler middleware
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const methodNotAllowedHandler = (req, res) => {
  const error = {
    status: 'error',
    statusCode: 405,
    message: 'Method Not Allowed',
    details: `${req.method} method is not supported for ${req.originalUrl}`
  };

  res.status(405).json(error);
};

module.exports = {
  notFoundHandler,
  methodNotAllowedHandler
};