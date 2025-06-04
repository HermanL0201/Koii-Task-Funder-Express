const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const cryptoPrices = require('./src/data/crypto-prices.json');

// Coins Markets Endpoint
app.get('/coins/markets', (req, res) => {
  const { vs_currency, ids } = req.query;
  
  if (!vs_currency) {
    return res.status(400).json({
      error: 'Missing required parameter: vs_currency'
    });
  }

  const prices = ids 
    ? Object.values(cryptoPrices).filter(coin => 
        ids.split(',').includes(coin.id)
      )
    : Object.values(cryptoPrices);

  res.json(prices.map(coin => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    current_price: coin.current_price
  })));
});

// Middleware for handling unsupported HTTP methods
const methodNotAllowed = (req, res, next) => {
  res.status(405).json({
    error: `Method ${req.method} not allowed for this endpoint`,
    allowed_methods: ['GET']
  });
};

// Add method not allowed handler to routes
app.all('/coins/markets', methodNotAllowed);

// 404 Not Found Middleware (should be last)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested endpoint ${req.path} does not exist`,
    available_endpoints: [
      '/coins/markets'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;