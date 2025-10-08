const { ethers } = require('ethers');
const { v4: uuidv4 } = require('uuid');

class IssuerService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
    );
    this.contractAddress = process.env.DID_REGISTRY_ADDRESS;
    this.contractABI = this.getDIDRegistryABI();
    this.issuerPrivateKey = process.env.ISSUER_PRIVATE_KEY;
    this.issuerWallet = this.issuerPrivateKey ? new ethers.Wallet(this.issuerPrivateKey, this.provider) : null;
    
    // In-memory storage for demo (use database in production)
    this.issuedCredentials = new Map();
    this.credentialTemplates = this.initializeTemplates();
  }

  /**
   * Get DID Registry contract ABI
   */
  getDIDRegistryABI() {
    return [
      "function issueCredential(string memory credentialId, string memory subjectDID, string memory issuerDID, string memory credentialType, string memory credentialData, uint256 expirationDate, bytes memory signature) external",
      "function revokeCredential(string memory credentialId) external",
      "function getCredential(string memory credentialId) external view returns (tuple(string credentialId, string subjectDID, string issuerDID, string credentialType, string credentialData, uint256 issuanceDate, uint256 expirationDate, bool revoked, bytes signature))",
      "function verifyCredential(string memory credentialId, bytes32 message) external view returns (bool)",
      "function getCredentialsForDID(string memory didId) external view returns (string[] memory)",
      "event CredentialIssued(string indexed credentialId, string indexed subjectDID, string indexed issuerDID)",
      "event CredentialRevoked(string indexed credentialId, string indexed issuerDID)"
    ];
  }

  /**
   * Initialize credential templates
   */
  initializeTemplates() {
    return {
      'UniversityDegree': {
        name: 'University Degree',
        description: 'Academic degree credential',
        requiredFields: ['university', 'degree', 'graduationDate', 'gpa'],
        schema: {
          '@context': ['https://www.w3.org/2018/credentials/v1', 'https://www.w3.org/2018/credentials/examples/v1'],
          type: ['VerifiableCredential', 'UniversityDegreeCredential']
        }
      },
      'IdentityVerification': {
        name: 'Identity Verification',
        description: 'Identity verification credential',
        requiredFields: ['fullName', 'dateOfBirth', 'nationality', 'documentNumber'],
        schema: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'IdentityCredential']
        }
      },
      'ProfessionalCertification': {
        name: 'Professional Certification',
        description: 'Professional skill or certification credential',
        requiredFields: ['certificationName', 'issuingOrganization', 'skillLevel', 'validUntil'],
        schema: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'ProfessionalCertificationCredential']
        }
      },
      'EmploymentVerification': {
        name: 'Employment Verification',
        description: 'Employment history verification credential',
        requiredFields: ['company', 'position', 'startDate', 'endDate', 'salary'],
        schema: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'EmploymentCredential']
        }
      }
    };
  }

  /**
   * Get contract instance
   */
  getContract() {
    if (!this.contractAddress) {
      throw new Error('DID Registry contract address not configured');
    }
    
    if (!this.issuerWallet) {
      throw new Error('Issuer wallet not configured');
    }

    return new ethers.Contract(this.contractAddress, this.contractABI, this.issuerWallet);
  }

  /**
   * Get issuer DID
   */
  getIssuerDID() {
    if (!this.issuerWallet) {
      throw new Error('Issuer wallet not configured');
    }
    return `did:ethr:sepolia:${this.issuerWallet.address}`;
  }

  /**
   * Create a verifiable credential
   */
  async createVerifiableCredential(credentialData) {
    try {
      const {
        subjectDID,
        credentialType,
        credentialSubject,
        expirationDate,
        additionalContext = []
      } = credentialData;

      if (!this.credentialTemplates[credentialType]) {
        throw new Error(`Unsupported credential type: ${credentialType}`);
      }

      const template = this.credentialTemplates[credentialType];
      const credentialId = uuidv4();
      const issuanceDate = new Date().toISOString();
      const issuerDID = this.getIssuerDID();

      // Validate required fields
      const missingFields = template.requiredFields.filter(field => 
        !(field in credentialSubject)
      );
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Create the verifiable credential
      const verifiableCredential = {
        '@context': [
          ...template.schema['@context'],
          ...additionalContext
        ],
        id: `urn:uuid:${credentialId}`,
        type: template.schema.type,
        issuer: {
          id: issuerDID,
          name: process.env.ISSUER_NAME || 'DID Issuer Service'
        },
        issuanceDate,
        expirationDate: expirationDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year default
        credentialSubject: {
          id: subjectDID,
          ...credentialSubject
        }
      };

      // Sign the credential
      const credentialJson = JSON.stringify(verifiableCredential);
      const messageHash = ethers.id(credentialJson);
      const signature = await this.issuerWallet.signMessage(ethers.getBytes(messageHash));

      // Add proof
      verifiableCredential.proof = {
        type: 'EcdsaSecp256k1Signature2019',
        created: issuanceDate,
        proofPurpose: 'assertionMethod',
        verificationMethod: `${issuerDID}#key-1`,
        jws: signature
      };

      return {
        success: true,
        data: {
          credentialId,
          verifiableCredential,
          signature,
          messageHash
        }
      };
    } catch (error) {
      console.error('Error creating verifiable credential:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Issue credential on blockchain
   */
  async issueCredentialOnChain(credentialId, verifiableCredential, signature) {
    try {
      const contract = this.getContract();
      const issuerDID = this.getIssuerDID();
      
      const credentialData = JSON.stringify(verifiableCredential);
      const expirationTimestamp = Math.floor(new Date(verifiableCredential.expirationDate).getTime() / 1000);

      console.log(`📝 Issuing credential ${credentialId} on blockchain...`);
      
      const tx = await contract.issueCredential(
        credentialId,
        verifiableCredential.credentialSubject.id,
        issuerDID,
        verifiableCredential.type[verifiableCredential.type.length - 1], // Last type is the specific credential type
        credentialData,
        expirationTimestamp,
        signature
      );

      console.log(`⏳ Transaction submitted: ${tx.hash}`);
      const receipt = await tx.wait();
      console.log(`✅ Credential issued successfully in block ${receipt.blockNumber}`);

      // Store locally
      this.issuedCredentials.set(credentialId, {
        credentialId,
        verifiableCredential,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        issuedAt: new Date().toISOString()
      });

      return {
        success: true,
        data: {
          credentialId,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        }
      };
    } catch (error) {
      console.error('Error issuing credential on chain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Issue complete verifiable credential (create + blockchain)
   */
  async issueCredential(credentialData) {
    try {
      // Create the verifiable credential
      const createResult = await this.createVerifiableCredential(credentialData);
      if (!createResult.success) {
        return createResult;
      }

      const { credentialId, verifiableCredential, signature } = createResult.data;

      // Issue on blockchain
      const issueResult = await this.issueCredentialOnChain(credentialId, verifiableCredential, signature);
      if (!issueResult.success) {
        return issueResult;
      }

      return {
        success: true,
        data: {
          credentialId,
          verifiableCredential,
          blockchain: issueResult.data
        }
      };
    } catch (error) {
      console.error('Error in complete credential issuance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Revoke a credential
   */
  async revokeCredential(credentialId) {
    try {
      const contract = this.getContract();

      console.log(`🚫 Revoking credential ${credentialId}...`);
      const tx = await contract.revokeCredential(credentialId);
      console.log(`⏳ Transaction submitted: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ Credential revoked successfully in block ${receipt.blockNumber}`);

      // Update local storage
      if (this.issuedCredentials.has(credentialId)) {
        const credential = this.issuedCredentials.get(credentialId);
        credential.revoked = true;
        credential.revokedAt = new Date().toISOString();
        credential.revocationTxHash = tx.hash;
        this.issuedCredentials.set(credentialId, credential);
      }

      return {
        success: true,
        data: {
          credentialId,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        }
      };
    } catch (error) {
      console.error('Error revoking credential:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get credential from blockchain
   */
  async getCredentialFromChain(credentialId) {
    try {
      const contract = this.getContract();
      const credential = await contract.getCredential(credentialId);

      if (credential.issuanceDate.toString() === '0') {
        throw new Error('Credential not found');
      }

      return {
        success: true,
        data: {
          credentialId: credential.credentialId,
          subjectDID: credential.subjectDID,
          issuerDID: credential.issuerDID,
          credentialType: credential.credentialType,
          credentialData: JSON.parse(credential.credentialData),
          issuanceDate: new Date(Number(credential.issuanceDate) * 1000).toISOString(),
          expirationDate: new Date(Number(credential.expirationDate) * 1000).toISOString(),
          revoked: credential.revoked,
          signature: credential.signature
        }
      };
    } catch (error) {
      console.error('Error getting credential from chain:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify credential signature
   */
  async verifyCredentialSignature(credentialId) {
    try {
      const contract = this.getContract();
      
      // Get credential from chain
      const credentialResult = await this.getCredentialFromChain(credentialId);
      if (!credentialResult.success) {
        return credentialResult;
      }

      const credential = credentialResult.data;
      const messageHash = ethers.id(JSON.stringify(credential.credentialData));
      
      const isValid = await contract.verifyCredential(credentialId, messageHash);

      return {
        success: true,
        data: {
          credentialId,
          isValid,
          credential
        }
      };
    } catch (error) {
      console.error('Error verifying credential signature:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all credential templates
   */
  getCredentialTemplates() {
    return this.credentialTemplates;
  }

  /**
   * Get issued credentials (local storage)
   */
  getIssuedCredentials() {
    return Array.from(this.issuedCredentials.values());
  }

  /**
   * Get specific issued credential (local storage)
   */
  getIssuedCredential(credentialId) {
    const credential = this.issuedCredentials.get(credentialId);
    if (!credential) {
      return {
        success: false,
        error: 'Credential not found in local storage'
      };
    }

    return {
      success: true,
      data: credential
    };
  }

  /**
   * Validate credential data against template
   */
  validateCredentialData(credentialType, credentialSubject) {
    const template = this.credentialTemplates[credentialType];
    if (!template) {
      return {
        success: false,
        error: `Unknown credential type: ${credentialType}`
      };
    }

    const missingFields = template.requiredFields.filter(field => 
      !(field in credentialSubject) || credentialSubject[field] === ''
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      };
    }

    return {
      success: true,
      data: { valid: true }
    };
  }
}

module.exports = IssuerService;