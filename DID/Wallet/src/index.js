const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const walletRoutes = require('./routes/wallet');
const didRoutes = require('./routes/did');
const transactionRoutes = require('./routes/transaction');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/wallet', walletRoutes);
app.use('/api/did', didRoutes);
app.use('/api/transaction', transactionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 DID Wallet Server running on port ${PORT}`);
  console.log(`📱 Network: ${process.env.NETWORK || 'sepolia'}`);
  console.log(`🔗 RPC URL: ${process.env.RPC_URL ? 'Configured' : 'Not configured'}`);
});