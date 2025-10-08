const express = require('express');
const DIDService = require('../services/DIDService');
const WalletService = require('../services/WalletService');

const router = express.Router();
const didService = new DIDService();
const walletService = new WalletService();

// Register new DID
router.post('/register', async (req, res) => {
  try {
    const { address, publicKeys, services } = req.body;
    
    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address is required' 
      });
    }

    // Get wallet to extract private key
    const wallet = walletService.getWallet(address);
    if (!wallet.success) {
      return res.status(404).json({ 
        success: false, 
        error: 'Wallet not found' 
      });
    }

    // Get private key from stored wallet
    const storedWallet = walletService.wallets.get(address);
    if (!storedWallet) {
      return res.status(404).json({ 
        success: false, 
        error: 'Private key not found' 
      });
    }

    const result = await didService.registerDID(
      storedWallet.privateKey, 
      address, 
      publicKeys || [storedWallet.publicKey], 
      services || []
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update DID
router.put('/:didId', async (req, res) => {
  try {
    const { didId } = req.params;
    const { address, publicKeys, services } = req.body;
    
    if (!didId || !address) {
      return res.status(400).json({ 
        success: false, 
        error: 'DID ID and address are required' 
      });
    }

    // Get wallet to extract private key
    const storedWallet = walletService.wallets.get(address);
    if (!storedWallet) {
      return res.status(404).json({ 
        success: false, 
        error: 'Wallet not found' 
      });
    }

    const result = await didService.updateDID(
      storedWallet.privateKey, 
      didId, 
      publicKeys || [storedWallet.publicKey], 
      services || []
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Revoke DID
router.delete('/:didId', async (req, res) => {
  try {
    const { didId } = req.params;
    const { address } = req.body;
    
    if (!didId || !address) {
      return res.status(400).json({ 
        success: false, 
        error: 'DID ID and address are required' 
      });
    }

    // Get wallet to extract private key
    const storedWallet = walletService.wallets.get(address);
    if (!storedWallet) {
      return res.status(404).json({ 
        success: false, 
        error: 'Wallet not found' 
      });
    }

    const result = await didService.revokeDID(storedWallet.privateKey, didId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Resolve DID
router.get('/:didId', async (req, res) => {
  try {
    const { didId } = req.params;
    
    if (!didId) {
      return res.status(400).json({ 
        success: false, 
        error: 'DID ID is required' 
      });
    }

    const result = await didService.resolveDID(didId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validate DID
router.get('/:didId/validate', async (req, res) => {
  try {
    const { didId } = req.params;
    
    if (!didId) {
      return res.status(400).json({ 
        success: false, 
        error: 'DID ID is required' 
      });
    }

    const result = await didService.validateDID(didId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get DIDs by owner
router.get('/owner/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Address is required' 
      });
    }

    const result = await didService.getDIDsByOwner(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create verifiable presentation
router.post('/presentation', async (req, res) => {
  try {
    const { credentials, holderDID, address } = req.body;
    
    if (!credentials || !holderDID || !address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Credentials, holder DID, and address are required' 
      });
    }

    // Get wallet to extract private key
    const storedWallet = walletService.wallets.get(address);
    if (!storedWallet) {
      return res.status(404).json({ 
        success: false, 
        error: 'Wallet not found' 
      });
    }

    const result = await didService.createVerifiablePresentation(
      credentials, 
      holderDID, 
      storedWallet.privateKey
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;