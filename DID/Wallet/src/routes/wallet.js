const express = require('express');
const WalletService = require('../services/WalletService');

const router = express.Router();
const walletService = new WalletService();

// Generate new wallet
router.post('/generate', (req, res) => {
  try {
    const result = walletService.generateWallet();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Import wallet from private key
router.post('/import/private-key', (req, res) => {
  try {
    const { privateKey } = req.body;
    
    if (!privateKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Private key is required' 
      });
    }

    const result = walletService.importWalletFromPrivateKey(privateKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Import wallet from mnemonic
router.post('/import/mnemonic', (req, res) => {
  try {
    const { mnemonic } = req.body;
    
    if (!mnemonic) {
      return res.status(400).json({ 
        success: false, 
        error: 'Mnemonic phrase is required' 
      });
    }

    const result = walletService.importWalletFromMnemonic(mnemonic);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get wallet balance
router.get('/:address/balance', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address is required' 
      });
    }

    const result = await walletService.getBalance(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get transaction history
router.get('/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address is required' 
      });
    }

    const result = await walletService.getTransactionHistory(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sign message
router.post('/sign', async (req, res) => {
  try {
    const { address, message } = req.body;
    
    if (!address || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address and message are required' 
      });
    }

    const result = await walletService.signMessage(address, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify message
router.post('/verify', (req, res) => {
  try {
    const { message, signature, address } = req.body;
    
    if (!message || !signature || !address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message, signature, and address are required' 
      });
    }

    const result = walletService.verifyMessage(message, signature, address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send transaction
router.post('/send', async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'From, to, and amount are required' 
      });
    }

    const result = await walletService.sendTransaction(from, to, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get wallet info
router.get('/:address', (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address is required' 
      });
    }

    const result = walletService.getWallet(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// List all wallets (development only)
router.get('/', (req, res) => {
  try {
    const wallets = walletService.getAllWallets();
    res.json({ 
      success: true, 
      data: { 
        count: wallets.length,
        wallets 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;