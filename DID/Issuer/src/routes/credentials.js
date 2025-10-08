const express = require('express');
const { body, validationResult } = require('express-validator');
const IssuerService = require('../services/IssuerService');

const router = express.Router();
const issuerService = new IssuerService();

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

// Issue a new verifiable credential
router.post('/issue', [
  body('subjectDID').notEmpty().withMessage('Subject DID is required'),
  body('credentialType').notEmpty().withMessage('Credential type is required'),
  body('credentialSubject').isObject().withMessage('Credential subject must be an object'),
  body('expirationDate').optional().isISO8601().withMessage('Expiration date must be valid ISO8601 date')
], handleValidation, async (req, res) => {
  try {
    const { subjectDID, credentialType, credentialSubject, expirationDate, additionalContext } = req.body;

    // Validate credential data against template
    const validation = issuerService.validateCredentialData(credentialType, credentialSubject);
    if (!validation.success) {
      return res.status(400).json(validation);
    }

    const result = await issuerService.issueCredential({
      subjectDID,
      credentialType,
      credentialSubject,
      expirationDate,
      additionalContext
    });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Revoke a credential
router.post('/:credentialId/revoke', async (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!credentialId) {
      return res.status(400).json({
        success: false,
        error: 'Credential ID is required'
      });
    }

    const result = await issuerService.revokeCredential(credentialId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get credential from blockchain
router.get('/:credentialId', async (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!credentialId) {
      return res.status(400).json({
        success: false,
        error: 'Credential ID is required'
      });
    }

    const result = await issuerService.getCredentialFromChain(credentialId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify credential signature
router.get('/:credentialId/verify', async (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!credentialId) {
      return res.status(400).json({
        success: false,
        error: 'Credential ID is required'
      });
    }

    const result = await issuerService.verifyCredentialSignature(credentialId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all issued credentials (local storage)
router.get('/', (req, res) => {
  try {
    const credentials = issuerService.getIssuedCredentials();
    res.json({
      success: true,
      data: {
        count: credentials.length,
        credentials
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific issued credential (local storage)
router.get('/local/:credentialId', (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!credentialId) {
      return res.status(400).json({
        success: false,
        error: 'Credential ID is required'
      });
    }

    const result = issuerService.getIssuedCredential(credentialId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validate credential data
router.post('/validate', [
  body('credentialType').notEmpty().withMessage('Credential type is required'),
  body('credentialSubject').isObject().withMessage('Credential subject must be an object')
], handleValidation, (req, res) => {
  try {
    const { credentialType, credentialSubject } = req.body;

    const result = issuerService.validateCredentialData(credentialType, credentialSubject);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;