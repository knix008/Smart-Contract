const express = require('express');
const { body, validationResult } = require('express-validator');
const VerifierService = require('../services/VerifierService');

const router = express.Router();
const verifierService = new VerifierService();

// Validation middleware
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Verify a single verifiable credential
router.post('/credential', [
  body('credential').isObject().withMessage('Credential must be an object')
], handleValidation, async (req, res) => {
  try {
    const { credential } = req.body;

    const result = await verifierService.verifyCredential(credential);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Verify multiple credentials
router.post('/credentials', [
  body('credentials').isArray().withMessage('Credentials must be an array'),
  body('credentials.*').isObject().withMessage('Each credential must be an object')
], handleValidation, async (req, res) => {
  try {
    const { credentials } = req.body;

    const results = [];
    for (const credential of credentials) {
      const result = await verifierService.verifyCredential(credential);
      results.push(result);
    }

    const allValid = results.every(r => r.isValid);
    
    res.json({
      success: true,
      data: {
        allValid,
        totalCredentials: results.length,
        validCredentials: results.filter(r => r.isValid).length,
        invalidCredentials: results.filter(r => !r.isValid).length,
        results
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Verify credential by ID from blockchain
router.get('/credential/:credentialId', async (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!credentialId) {
      return res.status(400).json({
        success: false,
        error: 'Credential ID is required'
      });
    }

    const result = await verifierService.verifyCredentialOnChain(credentialId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Verify DID validity
router.get('/did/:didId', async (req, res) => {
  try {
    const { didId } = req.params;

    if (!didId) {
      return res.status(400).json({
        success: false,
        error: 'DID is required'
      });
    }

    const issuerResult = await verifierService.verifyIssuerDID(didId);
    
    res.json({
      success: true,
      data: {
        didId,
        isValid: issuerResult.valid,
        error: issuerResult.error || null
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Batch verify multiple DIDs
router.post('/dids', [
  body('dids').isArray().withMessage('DIDs must be an array'),
  body('dids.*').isString().withMessage('Each DID must be a string')
], handleValidation, async (req, res) => {
  try {
    const { dids } = req.body;

    const results = [];
    for (const didId of dids) {
      const result = await verifierService.verifyIssuerDID(didId);
      results.push({
        didId,
        isValid: result.valid,
        error: result.error || null
      });
    }

    const allValid = results.every(r => r.isValid);
    
    res.json({
      success: true,
      data: {
        allValid,
        totalDIDs: results.length,
        validDIDs: results.filter(r => r.isValid).length,
        invalidDIDs: results.filter(r => !r.isValid).length,
        results
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get verification history
router.get('/history', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const history = verifierService.getVerificationHistory();
    
    const paginatedHistory = history.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        total: history.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        history: paginatedHistory
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get specific verification result
router.get('/history/:credentialId', (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!credentialId) {
      return res.status(400).json({
        success: false,
        error: 'Credential ID is required'
      });
    }

    const result = verifierService.getVerificationResult(credentialId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Verification result not found'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;