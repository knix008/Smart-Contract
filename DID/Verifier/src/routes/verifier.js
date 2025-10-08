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

// Get verifier information
router.get('/info', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        name: process.env.VERIFIER_NAME || 'DID Verifier Service',
        description: process.env.VERIFIER_DESCRIPTION || 'Verifiable Credential Verification Service',
        version: '1.0.0',
        network: process.env.NETWORK || 'sepolia',
        contractAddress: process.env.DID_REGISTRY_ADDRESS,
        supportedCredentialTypes: [
          'VerifiableCredential',
          'UniversityDegreeCredential',
          'IdentityCredential',
          'ProfessionalCertificationCredential',
          'EmploymentCredential'
        ],
        supportedPresentationTypes: [
          'VerifiablePresentation'
        ],
        verificationMethods: [
          'signature_verification',
          'blockchain_verification',
          'did_verification',
          'expiration_check',
          'revocation_check'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get verification statistics
router.get('/stats', (req, res) => {
  try {
    const stats = verifierService.getVerificationStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get trusted issuers
router.get('/trusted-issuers', (req, res) => {
  try {
    const trustedIssuers = verifierService.getTrustedIssuers();
    res.json({
      success: true,
      data: {
        count: trustedIssuers.length,
        trustedIssuers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add trusted issuer
router.post('/trusted-issuers', [
  body('issuerDID').notEmpty().withMessage('Issuer DID is required'),
  body('issuerDID').matches(/^did:/).withMessage('Issuer DID must start with "did:"')
], handleValidation, async (req, res) => {
  try {
    const { issuerDID } = req.body;

    // Verify the DID exists before adding as trusted
    const didCheck = await verifierService.verifyIssuerDID(issuerDID);
    if (!didCheck.valid) {
      return res.status(400).json({
        success: false,
        error: 'Cannot add invalid DID as trusted issuer',
        details: didCheck.error
      });
    }

    verifierService.addTrustedIssuer(issuerDID);
    
    res.status(201).json({
      success: true,
      data: {
        message: 'Issuer added to trusted list',
        issuerDID
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Remove trusted issuer
router.delete('/trusted-issuers/:issuerDID', (req, res) => {
  try {
    const { issuerDID } = req.params;

    if (!issuerDID) {
      return res.status(400).json({
        success: false,
        error: 'Issuer DID is required'
      });
    }

    const decodedDID = decodeURIComponent(issuerDID);
    verifierService.removeTrustedIssuer(decodedDID);
    
    res.json({
      success: true,
      data: {
        message: 'Issuer removed from trusted list',
        issuerDID: decodedDID
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check for verifier service
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        contractAddress: !!verifierService.contractAddress,
        providerConnected: true,
        serviceOperational: true
      }
    };

    // Test blockchain connectivity
    try {
      await verifierService.provider.getBlockNumber();
      health.checks.blockchainConnected = true;
    } catch (error) {
      health.checks.blockchainConnected = false;
      health.errors = health.errors || [];
      health.errors.push('Blockchain connection failed');
    }

    // Check if all critical components are working
    const isHealthy = Object.values(health.checks).every(check => check === true);
    
    if (!isHealthy) {
      health.status = 'unhealthy';
    }

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: health
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      }
    });
  }
});

// Get verification policies (configurable verification rules)
router.get('/policies', (req, res) => {
  try {
    const policies = {
      requireSignature: true,
      requireValidIssuer: true,
      requireValidSubject: false, // Subject DID validation is optional
      checkExpiration: true,
      checkRevocation: true,
      requireTrustedIssuer: false, // Trusted issuer requirement is optional
      allowSelfSigned: false,
      maxCredentialAge: 365 * 24 * 60 * 60, // 1 year in seconds
      requiredProofTypes: [
        'EcdsaSecp256k1Signature2019',
        'EcdsaSecp256k1RecoverySignature2020'
      ]
    };

    res.json({
      success: true,
      data: policies
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate verification report
router.post('/report', [
  body('credentials').optional().isArray().withMessage('Credentials must be an array'),
  body('presentations').optional().isArray().withMessage('Presentations must be an array'),
  body('reportType').optional().isIn(['summary', 'detailed']).withMessage('Report type must be summary or detailed')
], handleValidation, async (req, res) => {
  try {
    const { 
      credentials = [], 
      presentations = [], 
      reportType = 'summary' 
    } = req.body;

    const report = {
      timestamp: new Date().toISOString(),
      reportType,
      summary: {
        totalCredentials: credentials.length,
        totalPresentations: presentations.length,
        validCredentials: 0,
        invalidCredentials: 0,
        validPresentations: 0,
        invalidPresentations: 0
      },
      results: {
        credentials: [],
        presentations: []
      }
    };

    // Verify credentials
    for (const credential of credentials) {
      const result = await verifierService.verifyCredential(credential);
      if (reportType === 'detailed') {
        report.results.credentials.push(result);
      }
      
      if (result.isValid) {
        report.summary.validCredentials++;
      } else {
        report.summary.invalidCredentials++;
      }
    }

    // Verify presentations
    for (const presentation of presentations) {
      const result = await verifierService.verifyPresentation(presentation);
      if (reportType === 'detailed') {
        report.results.presentations.push(result);
      }
      
      if (result.isValid) {
        report.summary.validPresentations++;
      } else {
        report.summary.invalidPresentations++;
      }
    }

    // Calculate overall validity
    const totalItems = credentials.length + presentations.length;
    const validItems = report.summary.validCredentials + report.summary.validPresentations;
    report.summary.overallValidityRate = totalItems > 0 ? (validItems / totalItems * 100).toFixed(2) : '0.00';

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;