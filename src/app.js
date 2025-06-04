const express = require('express');
const { notFoundHandler, methodNotAllowedHandler } = require('./middleware/errorHandler');

const app = express();

// Add any existing routes here
// For example: app.use('/api/coins', coinRoutes);

// Add method not allowed handler before not found handler
app.use(methodNotAllowedHandler);

// Add not found handler last
app.use(notFoundHandler);

module.exports = app;