const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const verificationRoutes = require('./routes/verification');
const presentationRoutes = require('./routes/presentation');
const verifierRoutes = require('./routes/verifier');

const app = express();
const PORT = process.env.PORT || 3003;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limit each IP to 200 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files for the web interface
app.use('/web', express.static(path.join(__dirname, '../public')));

// Root redirect to web interface
app.get('/', (req, res) => {
  res.redirect('/web');
});

// Routes
app.use('/api/verify', verificationRoutes);
app.use('/api/presentation', presentationRoutes);
app.use('/api/verifier', verifierRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'DID Verifier Service'
  });
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
  console.log(`🔍 DID Verifier Service running on port ${PORT}`);
  console.log(`📱 Network: ${process.env.NETWORK || 'sepolia'}`);
  console.log(`🔗 Contract: ${process.env.DID_REGISTRY_ADDRESS ? 'Configured' : 'Not configured'}`);
});