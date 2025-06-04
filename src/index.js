const express = require('express');
const { fetchCryptoPrice, SUPPORTED_SYMBOLS } = require('./priceService');

const app = express();
const PORT = process.env.PORT || 3000;

// Price endpoint
app.get('/api/price/:symbol', async (req, res) => {
    try {
        const symbol = req.params.symbol;
        const price = await fetchCryptoPrice(symbol);
        
        res.json({
            symbol: symbol.toUpperCase(),
            price: price,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(error.message.includes('Unsupported') ? 400 : 500)
           .json({ 
               error: error.message,
               supportedSymbols: SUPPORTED_SYMBOLS 
           });
    }
});

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;