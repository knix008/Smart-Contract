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

// Verify a verifiable presentation
router.post('/verify', [
  body('presentation').isObject().withMessage('Presentation must be an object')
], handleValidation, async (req, res) => {
  try {
    const { presentation } = req.body;

    const result = await verifierService.verifyPresentation(presentation);
    
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

// Verify multiple presentations
router.post('/verify-batch', [
  body('presentations').isArray().withMessage('Presentations must be an array'),
  body('presentations.*').isObject().withMessage('Each presentation must be an object')
], handleValidation, async (req, res) => {
  try {
    const { presentations } = req.body;

    const results = [];
    for (const presentation of presentations) {
      const result = await verifierService.verifyPresentation(presentation);
      results.push(result);
    }

    const allValid = results.every(r => r.isValid);
    
    res.json({
      success: true,
      data: {
        allValid,
        totalPresentations: results.length,
        validPresentations: results.filter(r => r.isValid).length,
        invalidPresentations: results.filter(r => !r.isValid).length,
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

// Create verification request (for requesting specific credentials)
router.post('/request', [
  body('verifierDID').notEmpty().withMessage('Verifier DID is required'),
  body('requestedCredentials').isArray().withMessage('Requested credentials must be an array'),
  body('purpose').optional().isString().withMessage('Purpose must be a string'),
  body('challenge').optional().isString().withMessage('Challenge must be a string')
], handleValidation, (req, res) => {
  try {
    const { 
      verifierDID, 
      requestedCredentials, 
      purpose = 'Authentication',
      challenge = `challenge-${Date.now()}`,
      domain = req.get('host')
    } = req.body;

    const verificationRequest = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: 'VerifiablePresentationRequest',
      verifier: verifierDID,
      challenge,
      domain,
      purpose,
      requestedCredentials: requestedCredentials.map(cred => ({
        type: cred.type || 'VerifiableCredential',
        constraints: cred.constraints || {},
        reason: cred.reason || 'Required for verification'
      })),
      created: new Date().toISOString(),
      expires: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
    };

    res.status(201).json({
      success: true,
      data: verificationRequest
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Validate presentation request response
router.post('/validate-response', [
  body('request').isObject().withMessage('Original request must be an object'),
  body('presentation').isObject().withMessage('Presentation response must be an object')
], handleValidation, async (req, res) => {
  try {
    const { request, presentation } = req.body;

    // 1. Verify the presentation
    const presentationResult = await verifierService.verifyPresentation(presentation);
    
    if (!presentationResult.isValid) {
      return res.json({
        success: true,
        data: {
          requestValid: false,
          presentationValid: false,
          reason: 'Presentation verification failed',
          presentationResult
        }
      });
    }

    // 2. Check if presentation matches the request
    const requestValidation = this.validatePresentationAgainstRequest(request, presentation);
    
    res.json({
      success: true,
      data: {
        requestValid: requestValidation.valid,
        presentationValid: presentationResult.isValid,
        reason: requestValidation.reason || 'Valid response',
        presentationResult,
        requestValidation
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Helper method to validate presentation against request
router.validatePresentationAgainstRequest = function(request, presentation) {
  try {
    // Check if request is expired
    if (request.expires && new Date(request.expires) < new Date()) {
      return {
        valid: false,
        reason: 'Verification request has expired'
      };
    }

    // Check if presentation contains required credentials
    const requestedTypes = request.requestedCredentials.map(rc => rc.type);
    const presentedTypes = presentation.verifiableCredential.map(vc => 
      vc.type[vc.type.length - 1] // Get the specific credential type
    );

    const missingTypes = requestedTypes.filter(type => 
      type === 'VerifiableCredential' || presentedTypes.includes(type)
    );

    if (missingTypes.length < requestedTypes.length) {
      return {
        valid: false,
        reason: 'Missing required credential types',
        missingTypes: requestedTypes.filter(type => !presentedTypes.includes(type))
      };
    }

    // Check challenge and domain if provided
    if (request.challenge && presentation.proof) {
      const presentationChallenge = presentation.proof.challenge;
      if (presentationChallenge !== request.challenge) {
        return {
          valid: false,
          reason: 'Challenge mismatch'
        };
      }
    }

    return {
      valid: true,
      reason: 'Presentation matches request requirements'
    };
  } catch (error) {
    return {
      valid: false,
      reason: `Validation error: ${error.message}`
    };
  }
};

module.exports = router;