const { ethers } = require('ethers');
const axios = require('axios');

class VerifierService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
    );
    this.contractAddress = process.env.DID_REGISTRY_ADDRESS;
    this.contractABI = this.getDIDRegistryABI();
    
    // Verification history (in production, use database)
    this.verificationHistory = new Map();
    this.trustedIssuers = this.initializeTrustedIssuers();
  }

  /**
   * Get DID Registry contract ABI
   */
  getDIDRegistryABI() {
    return [
      "function getDIDDocument(string memory didId) external view returns (tuple(string id, address owner, string[] publicKeys, string[] services, uint256 created, uint256 updated, bool exists, bool revoked))",
      "function getCredential(string memory credentialId) external view returns (tuple(string credentialId, string subjectDID, string issuerDID, string credentialType, string credentialData, uint256 issuanceDate, uint256 expirationDate, bool revoked, bytes signature))",
      "function verifyCredential(string memory credentialId, bytes32 message) external view returns (bool)",
      "function isDIDValid(string memory didId) external view returns (bool)",
      "function getCredentialsForDID(string memory didId) external view returns (string[] memory)"
    ];
  }

  /**
   * Initialize trusted issuers list
   */
  initializeTrustedIssuers() {
    return new Set([
      // Add trusted issuer DIDs here
      // Example: 'did:ethr:sepolia:0x1234...'
    ]);
  }

  /**
   * Get contract instance
   */
  getContract() {
    if (!this.contractAddress) {
      throw new Error('DID Registry contract address not configured');
    }

    return new ethers.Contract(this.contractAddress, this.contractABI, this.provider);
  }

  /**
   * Verify a single verifiable credential
   */
  async verifyCredential(credential) {
    try {
      const verificationResult = {
        credentialId: credential.id || 'unknown',
        isValid: false,
        errors: [],
        warnings: [],
        details: {
          structureValid: false,
          signatureValid: false,
          issuerValid: false,
          subjectValid: false,
          expirationValid: false,
          revocationValid: false,
          blockchainValid: false
        },
        timestamp: new Date().toISOString()
      };

      // 1. Check credential structure
      const structureCheck = this.validateCredentialStructure(credential);
      verificationResult.details.structureValid = structureCheck.valid;
      if (!structureCheck.valid) {
        verificationResult.errors.push(...structureCheck.errors);
        return verificationResult;
      }

      // 2. Check expiration
      const expirationCheck = this.checkExpiration(credential);
      verificationResult.details.expirationValid = expirationCheck.valid;
      if (!expirationCheck.valid) {
        verificationResult.errors.push(expirationCheck.error);
      }

      // 3. Verify issuer DID
      const issuerCheck = await this.verifyIssuerDID(credential.issuer.id);
      verificationResult.details.issuerValid = issuerCheck.valid;
      if (!issuerCheck.valid) {
        verificationResult.errors.push(issuerCheck.error);
      }

      // 4. Verify subject DID (if exists)
      if (credential.credentialSubject.id) {
        const subjectCheck = await this.verifySubjectDID(credential.credentialSubject.id);
        verificationResult.details.subjectValid = subjectCheck.valid;
        if (!subjectCheck.valid) {
          verificationResult.warnings.push(subjectCheck.error);
        }
      } else {
        verificationResult.details.subjectValid = true;
      }

      // 5. Verify signature
      const signatureCheck = await this.verifyCredentialSignature(credential);
      verificationResult.details.signatureValid = signatureCheck.valid;
      if (!signatureCheck.valid) {
        verificationResult.errors.push(signatureCheck.error);
      }

      // 6. Check blockchain status (if credential has an ID that could be on chain)
      if (credential.id && credential.id.startsWith('urn:uuid:')) {
        const credentialId = credential.id.replace('urn:uuid:', '');
        const blockchainCheck = await this.verifyCredentialOnChain(credentialId);
        verificationResult.details.blockchainValid = blockchainCheck.valid;
        verificationResult.details.revocationValid = !blockchainCheck.revoked;
        
        if (blockchainCheck.revoked) {
          verificationResult.errors.push('Credential has been revoked on blockchain');
        }
      } else {
        verificationResult.details.blockchainValid = true;
        verificationResult.details.revocationValid = true;
      }

      // 7. Check if issuer is trusted
      if (this.trustedIssuers.has(credential.issuer.id)) {
        verificationResult.warnings.push('Issuer is in trusted list');
      }

      // Final validity check
      verificationResult.isValid = 
        verificationResult.details.structureValid &&
        verificationResult.details.signatureValid &&
        verificationResult.details.issuerValid &&
        verificationResult.details.subjectValid &&
        verificationResult.details.expirationValid &&
        verificationResult.details.revocationValid &&
        verificationResult.details.blockchainValid;

      // Store verification result
      this.verificationHistory.set(verificationResult.credentialId, verificationResult);

      return verificationResult;
    } catch (error) {
      console.error('Error verifying credential:', error);
      return {
        credentialId: credential.id || 'unknown',
        isValid: false,
        errors: [`Verification failed: ${error.message}`],
        warnings: [],
        details: {},
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Validate credential structure
   */
  validateCredentialStructure(credential) {
    const errors = [];

    // Check required fields
    if (!credential['@context']) {
      errors.push('Missing @context field');
    }

    if (!credential.type || !Array.isArray(credential.type)) {
      errors.push('Missing or invalid type field');
    } else if (!credential.type.includes('VerifiableCredential')) {
      errors.push('Type must include VerifiableCredential');
    }

    if (!credential.issuer) {
      errors.push('Missing issuer field');
    } else if (typeof credential.issuer === 'string') {
      if (!credential.issuer.startsWith('did:')) {
        errors.push('Issuer must be a valid DID');
      }
    } else if (typeof credential.issuer === 'object') {
      if (!credential.issuer.id || !credential.issuer.id.startsWith('did:')) {
        errors.push('Issuer.id must be a valid DID');
      }
    } else {
      errors.push('Issuer must be a string DID or object with id');
    }

    if (!credential.issuanceDate) {
      errors.push('Missing issuanceDate field');
    } else {
      try {
        new Date(credential.issuanceDate);
      } catch {
        errors.push('Invalid issuanceDate format');
      }
    }

    if (!credential.credentialSubject) {
      errors.push('Missing credentialSubject field');
    }

    if (!credential.proof) {
      errors.push('Missing proof field');
    } else {
      if (!credential.proof.type) {
        errors.push('Missing proof type');
      }
      if (!credential.proof.jws && !credential.proof.proofValue) {
        errors.push('Missing proof signature (jws or proofValue)');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if credential is expired
   */
  checkExpiration(credential) {
    if (!credential.expirationDate) {
      return { valid: true }; // No expiration date means no expiration
    }

    try {
      const expirationDate = new Date(credential.expirationDate);
      const now = new Date();

      if (expirationDate <= now) {
        return {
          valid: false,
          error: `Credential expired on ${expirationDate.toISOString()}`
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: 'Invalid expiration date format'
      };
    }
  }

  /**
   * Verify issuer DID exists and is valid
   */
  async verifyIssuerDID(issuerDID) {
    try {
      const contract = this.getContract();
      const isValid = await contract.isDIDValid(issuerDID);

      if (!isValid) {
        return {
          valid: false,
          error: 'Issuer DID does not exist or has been revoked'
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Failed to verify issuer DID: ${error.message}`
      };
    }
  }

  /**
   * Verify subject DID exists and is valid
   */
  async verifySubjectDID(subjectDID) {
    try {
      const contract = this.getContract();
      const isValid = await contract.isDIDValid(subjectDID);

      if (!isValid) {
        return {
          valid: false,
          error: 'Subject DID does not exist or has been revoked'
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Failed to verify subject DID: ${error.message}`
      };
    }
  }

  /**
   * Verify credential signature
   */
  async verifyCredentialSignature(credential) {
    try {
      // Extract signature from proof
      const signature = credential.proof.jws || credential.proof.proofValue;
      if (!signature) {
        return {
          valid: false,
          error: 'No signature found in proof'
        };
      }

      // Create message hash from credential (excluding proof)
      const { proof, ...credentialWithoutProof } = credential;
      const message = JSON.stringify(credentialWithoutProof);
      const messageHash = ethers.id(message);

      // Recover signer address
      const recoveredAddress = ethers.verifyMessage(ethers.getBytes(messageHash), signature);

      // Get issuer DID document to check if signer is authorized
      const issuerDID = typeof credential.issuer === 'string' ? credential.issuer : credential.issuer.id;
      const contract = this.getContract();
      const didDocument = await contract.getDIDDocument(issuerDID);

      if (didDocument.owner.toLowerCase() !== recoveredAddress.toLowerCase()) {
        return {
          valid: false,
          error: 'Signature does not match issuer DID owner'
        };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Signature verification failed: ${error.message}`
      };
    }
  }

  /**
   * Verify credential on blockchain
   */
  async verifyCredentialOnChain(credentialId) {
    try {
      const contract = this.getContract();
      const credential = await contract.getCredential(credentialId);

      if (credential.issuanceDate.toString() === '0') {
        return {
          valid: false,
          revoked: false,
          error: 'Credential not found on blockchain'
        };
      }

      return {
        valid: true,
        revoked: credential.revoked,
        credential: {
          credentialId: credential.credentialId,
          subjectDID: credential.subjectDID,
          issuerDID: credential.issuerDID,
          credentialType: credential.credentialType,
          issuanceDate: new Date(Number(credential.issuanceDate) * 1000).toISOString(),
          expirationDate: new Date(Number(credential.expirationDate) * 1000).toISOString(),
          revoked: credential.revoked
        }
      };
    } catch (error) {
      return {
        valid: false,
        revoked: false,
        error: `Blockchain verification failed: ${error.message}`
      };
    }
  }

  /**
   * Verify a verifiable presentation
   */
  async verifyPresentation(presentation) {
    try {
      const verificationResult = {
        isValid: false,
        holderValid: false,
        presentationSignatureValid: false,
        credentialsValid: [],
        errors: [],
        warnings: [],
        timestamp: new Date().toISOString()
      };

      // 1. Validate presentation structure
      if (!presentation['@context'] || !presentation.type || !Array.isArray(presentation.type)) {
        verificationResult.errors.push('Invalid presentation structure');
        return verificationResult;
      }

      if (!presentation.type.includes('VerifiablePresentation')) {
        verificationResult.errors.push('Type must include VerifiablePresentation');
        return verificationResult;
      }

      // 2. Verify holder DID
      if (presentation.holder) {
        const holderCheck = await this.verifySubjectDID(presentation.holder);
        verificationResult.holderValid = holderCheck.valid;
        if (!holderCheck.valid) {
          verificationResult.errors.push(`Holder verification failed: ${holderCheck.error}`);
        }
      } else {
        verificationResult.holderValid = true;
      }

      // 3. Verify presentation signature
      if (presentation.proof) {
        const presentationSignatureCheck = await this.verifyPresentationSignature(presentation);
        verificationResult.presentationSignatureValid = presentationSignatureCheck.valid;
        if (!presentationSignatureCheck.valid) {
          verificationResult.errors.push(`Presentation signature verification failed: ${presentationSignatureCheck.error}`);
        }
      } else {
        verificationResult.presentationSignatureValid = true; // Optional for presentations
      }

      // 4. Verify each credential in the presentation
      if (presentation.verifiableCredential && Array.isArray(presentation.verifiableCredential)) {
        for (const credential of presentation.verifiableCredential) {
          const credentialResult = await this.verifyCredential(credential);
          verificationResult.credentialsValid.push(credentialResult);
          
          if (!credentialResult.isValid) {
            verificationResult.errors.push(`Credential ${credentialResult.credentialId} is invalid`);
          }
        }
      }

      // 5. Final validation
      verificationResult.isValid = 
        verificationResult.holderValid &&
        verificationResult.presentationSignatureValid &&
        verificationResult.credentialsValid.every(c => c.isValid);

      return verificationResult;
    } catch (error) {
      console.error('Error verifying presentation:', error);
      return {
        isValid: false,
        holderValid: false,
        presentationSignatureValid: false,
        credentialsValid: [],
        errors: [`Presentation verification failed: ${error.message}`],
        warnings: [],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Verify presentation signature
   */
  async verifyPresentationSignature(presentation) {
    try {
      if (!presentation.proof || !presentation.proof.jws) {
        return { valid: true }; // No signature to verify
      }

      const signature = presentation.proof.jws;
      const { proof, ...presentationWithoutProof } = presentation;
      const message = JSON.stringify(presentationWithoutProof);

      const recoveredAddress = ethers.verifyMessage(message, signature);

      // If holder is specified, check if signature matches holder's DID
      if (presentation.holder) {
        const contract = this.getContract();
        const didDocument = await contract.getDIDDocument(presentation.holder);

        if (didDocument.owner.toLowerCase() !== recoveredAddress.toLowerCase()) {
          return {
            valid: false,
            error: 'Presentation signature does not match holder DID'
          };
        }
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: `Presentation signature verification failed: ${error.message}`
      };
    }
  }

  /**
   * Get verification history
   */
  getVerificationHistory() {
    return Array.from(this.verificationHistory.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Get specific verification result
   */
  getVerificationResult(credentialId) {
    return this.verificationHistory.get(credentialId);
  }

  /**
   * Add trusted issuer
   */
  addTrustedIssuer(issuerDID) {
    this.trustedIssuers.add(issuerDID);
  }

  /**
   * Remove trusted issuer
   */
  removeTrustedIssuer(issuerDID) {
    this.trustedIssuers.delete(issuerDID);
  }

  /**
   * Get trusted issuers
   */
  getTrustedIssuers() {
    return Array.from(this.trustedIssuers);
  }

  /**
   * Get verification statistics
   */
  getVerificationStats() {
    const history = this.getVerificationHistory();
    const total = history.length;
    const valid = history.filter(v => v.isValid).length;
    const invalid = total - valid;

    const last24Hours = history.filter(v => 
      new Date(v.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    return {
      total,
      valid,
      invalid,
      successRate: total > 0 ? (valid / total * 100).toFixed(2) : '0.00',
      last24Hours: last24Hours.length,
      recentActivity: history.slice(0, 10)
    };
  }
}

module.exports = VerifierService;