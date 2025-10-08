const { ethers } = require('ethers');
const crypto = require('crypto');

class DIDService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
    );
    this.contractAddress = process.env.DID_REGISTRY_ADDRESS;
    this.contractABI = this.getDIDRegistryABI();
  }

  /**
   * Get DID Registry contract ABI
   * @returns {Array} Contract ABI
   */
  getDIDRegistryABI() {
    return [
      "function registerDID(string memory didId, string[] memory publicKeys, string[] memory services) external",
      "function updateDID(string memory didId, string[] memory publicKeys, string[] memory services) external",
      "function revokeDID(string memory didId) external",
      "function getDIDDocument(string memory didId) external view returns (tuple(string id, address owner, string[] publicKeys, string[] services, uint256 created, uint256 updated, bool exists, bool revoked))",
      "function isDIDValid(string memory didId) external view returns (bool)",
      "function getDIDsByOwner(address owner) external view returns (string[] memory)",
      "event DIDRegistered(string indexed didId, address indexed owner, uint256 timestamp)",
      "event DIDUpdated(string indexed didId, address indexed owner, uint256 timestamp)",
      "event DIDRevoked(string indexed didId, address indexed owner, uint256 timestamp)"
    ];
  }

  /**
   * Get contract instance
   * @param {string} privateKey - Private key for signing transactions
   * @returns {Object} Contract instance
   */
  getContract(privateKey = null) {
    if (!this.contractAddress) {
      throw new Error('DID Registry contract address not configured');
    }

    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      return new ethers.Contract(this.contractAddress, this.contractABI, wallet);
    } else {
      return new ethers.Contract(this.contractAddress, this.contractABI, this.provider);
    }
  }

  /**
   * Generate a new DID
   * @param {string} address - Ethereum address
   * @returns {string} DID identifier
   */
  generateDID(address) {
    return `did:ethr:sepolia:${address}`;
  }

  /**
   * Create DID Document
   * @param {string} didId - DID identifier
   * @param {string} address - Ethereum address
   * @param {Array} publicKeys - Public keys
   * @param {Array} services - Service endpoints
   * @returns {Object} DID Document
   */
  createDIDDocument(didId, address, publicKeys = [], services = []) {
    return {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/secp256k1recovery-2020/v2"
      ],
      "id": didId,
      "controller": didId,
      "verificationMethod": publicKeys.map((key, index) => ({
        "id": `${didId}#key-${index + 1}`,
        "type": "EcdsaSecp256k1RecoveryMethod2020",
        "controller": didId,
        "publicKeyHex": key
      })),
      "authentication": publicKeys.map((_, index) => `${didId}#key-${index + 1}`),
      "assertionMethod": publicKeys.map((_, index) => `${didId}#key-${index + 1}`),
      "service": services.map((service, index) => ({
        "id": `${didId}#service-${index + 1}`,
        "type": "LinkedDomains",
        "serviceEndpoint": service
      }))
    };
  }

  /**
   * Register a new DID
   * @param {string} privateKey - Private key for signing
   * @param {string} address - Ethereum address
   * @param {Array} publicKeys - Public keys
   * @param {Array} services - Service endpoints
   * @returns {Object} Registration result
   */
  async registerDID(privateKey, address, publicKeys = [], services = []) {
    try {
      const didId = this.generateDID(address);
      const contract = this.getContract(privateKey);

      // If no public keys provided, use the wallet's public key
      if (publicKeys.length === 0) {
        const wallet = new ethers.Wallet(privateKey);
        publicKeys = [wallet.publicKey];
      }

      console.log(`📝 Registering DID: ${didId}`);
      const tx = await contract.registerDID(didId, publicKeys, services);
      console.log(`⏳ Transaction submitted: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ DID registered successfully in block ${receipt.blockNumber}`);

      const didDocument = this.createDIDDocument(didId, address, publicKeys, services);

      return {
        success: true,
        data: {
          didId,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          didDocument
        }
      };
    } catch (error) {
      console.error('Error registering DID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update an existing DID
   * @param {string} privateKey - Private key for signing
   * @param {string} didId - DID identifier
   * @param {Array} publicKeys - New public keys
   * @param {Array} services - New service endpoints
   * @returns {Object} Update result
   */
  async updateDID(privateKey, didId, publicKeys, services) {
    try {
      const contract = this.getContract(privateKey);

      console.log(`📝 Updating DID: ${didId}`);
      const tx = await contract.updateDID(didId, publicKeys, services);
      console.log(`⏳ Transaction submitted: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ DID updated successfully in block ${receipt.blockNumber}`);

      return {
        success: true,
        data: {
          didId,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        }
      };
    } catch (error) {
      console.error('Error updating DID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Revoke a DID
   * @param {string} privateKey - Private key for signing
   * @param {string} didId - DID identifier
   * @returns {Object} Revocation result
   */
  async revokeDID(privateKey, didId) {
    try {
      const contract = this.getContract(privateKey);

      console.log(`🚫 Revoking DID: ${didId}`);
      const tx = await contract.revokeDID(didId);
      console.log(`⏳ Transaction submitted: ${tx.hash}`);
      
      const receipt = await tx.wait();
      console.log(`✅ DID revoked successfully in block ${receipt.blockNumber}`);

      return {
        success: true,
        data: {
          didId,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        }
      };
    } catch (error) {
      console.error('Error revoking DID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Resolve a DID to get its document
   * @param {string} didId - DID identifier
   * @returns {Object} DID Document
   */
  async resolveDID(didId) {
    try {
      const contract = this.getContract();
      
      console.log(`🔍 Resolving DID: ${didId}`);
      const didData = await contract.getDIDDocument(didId);
      
      if (!didData.exists) {
        throw new Error('DID does not exist');
      }

      const didDocument = this.createDIDDocument(
        didData.id,
        didData.owner,
        didData.publicKeys,
        didData.services
      );

      return {
        success: true,
        data: {
          didDocument,
          metadata: {
            created: new Date(Number(didData.created) * 1000).toISOString(),
            updated: new Date(Number(didData.updated) * 1000).toISOString(),
            owner: didData.owner,
            revoked: didData.revoked
          }
        }
      };
    } catch (error) {
      console.error('Error resolving DID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if a DID is valid
   * @param {string} didId - DID identifier
   * @returns {Object} Validation result
   */
  async validateDID(didId) {
    try {
      const contract = this.getContract();
      
      const isValid = await contract.isDIDValid(didId);
      
      return {
        success: true,
        data: {
          didId,
          isValid
        }
      };
    } catch (error) {
      console.error('Error validating DID:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all DIDs owned by an address
   * @param {string} address - Owner address
   * @returns {Object} List of DIDs
   */
  async getDIDsByOwner(address) {
    try {
      const contract = this.getContract();
      
      const dids = await contract.getDIDsByOwner(address);
      
      return {
        success: true,
        data: {
          owner: address,
          dids: dids
        }
      };
    } catch (error) {
      console.error('Error getting DIDs by owner:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a verifiable presentation
   * @param {Array} credentials - Array of verifiable credentials
   * @param {string} holderDID - DID of the holder
   * @param {string} privateKey - Private key for signing
   * @returns {Object} Verifiable Presentation
   */
  async createVerifiablePresentation(credentials, holderDID, privateKey) {
    try {
      const wallet = new ethers.Wallet(privateKey);
      
      const presentation = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1"
        ],
        "type": ["VerifiablePresentation"],
        "holder": holderDID,
        "verifiableCredential": credentials,
        "created": new Date().toISOString()
      };

      // Sign the presentation
      const message = JSON.stringify(presentation);
      const signature = await wallet.signMessage(message);

      presentation.proof = {
        "type": "EcdsaSecp256k1Signature2019",
        "created": new Date().toISOString(),
        "proofPurpose": "authentication",
        "verificationMethod": `${holderDID}#key-1`,
        "jws": signature
      };

      return {
        success: true,
        data: presentation
      };
    } catch (error) {
      console.error('Error creating verifiable presentation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = DIDService;