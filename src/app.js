const express = require('express');
const { notFoundHandler, methodNotAllowedHandler } = require('./middleware/errorHandler');

const app = express();

// Catch-all route to demonstrate error handling
app.all('*', (req, res, next) => {
  // This allows us to test different routes
  next();
});

// Add method not allowed handler before not found handler
app.use(methodNotAllowedHandler);

// Add not found handler last
app.use(notFoundHandler);

module.exports = app;