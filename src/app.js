const express = require('express');
const { notFoundHandler, methodNotAllowedHandler } = require('./middleware/errorHandler');

const app = express();

// Add a route that will only handle specific methods
app.get('/', (req, res) => {
  // This ensures '/' route is limited to GET
  res.status(200).json({ message: 'Welcome to the Mock CoinGecko API' });
});

// Add method not allowed handler for routes that exist but have unsupported methods
app.use(methodNotAllowedHandler);

// Add not found handler last to catch all unhandled routes
app.use(notFoundHandler);

module.exports = app;