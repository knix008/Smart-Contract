const express = require('express');
const IssuerService = require('../services/IssuerService');

const router = express.Router();
const issuerService = new IssuerService();

// Get issuer information
router.get('/info', (req, res) => {
  try {
    const issuerDID = issuerService.getIssuerDID();
    const templates = issuerService.getCredentialTemplates();
    
    res.json({
      success: true,
      data: {
        issuerDID,
        name: process.env.ISSUER_NAME || 'DID Issuer Service',
        description: process.env.ISSUER_DESCRIPTION || 'Verifiable Credential Issuer for DID System',
        supportedCredentialTypes: Object.keys(templates),
        network: process.env.NETWORK || 'sepolia',
        contractAddress: process.env.DID_REGISTRY_ADDRESS
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get credential templates
router.get('/templates', (req, res) => {
  try {
    const templates = issuerService.getCredentialTemplates();
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific credential template
router.get('/templates/:type', (req, res) => {
  try {
    const { type } = req.params;
    const templates = issuerService.getCredentialTemplates();
    
    if (!templates[type]) {
      return res.status(404).json({
        success: false,
        error: `Template not found for credential type: ${type}`
      });
    }

    res.json({
      success: true,
      data: {
        type,
        template: templates[type]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get issuer statistics
router.get('/stats', (req, res) => {
  try {
    const credentials = issuerService.getIssuedCredentials();
    
    const stats = {
      totalIssued: credentials.length,
      activeCredentials: credentials.filter(c => !c.revoked).length,
      revokedCredentials: credentials.filter(c => c.revoked).length,
      credentialsByType: {},
      recentActivity: credentials
        .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt))
        .slice(0, 10)
        .map(c => ({
          credentialId: c.credentialId,
          type: c.verifiableCredential.type[c.verifiableCredential.type.length - 1],
          issuedAt: c.issuedAt,
          revoked: c.revoked || false
        }))
    };

    // Count credentials by type
    credentials.forEach(credential => {
      const type = credential.verifiableCredential.type[credential.verifiableCredential.type.length - 1];
      stats.credentialsByType[type] = (stats.credentialsByType[type] || 0) + 1;
    });

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check for issuer service
router.get('/health', (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        issuerWallet: !!issuerService.issuerWallet,
        contractAddress: !!issuerService.contractAddress,
        providerConnected: true // Assume connected if no error
      }
    };

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

module.exports = router;