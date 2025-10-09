# DID Registry Smart Contract

A comprehensive Decentralized Identity (DID) Registry smart contract built with Solidity and deployed on Sepolia Testnet. This contract enables DID registration, management, and Verifiable Credential issuance/verification.

## 📋 Overview

The DID Registry contract provides the following core functionality:

- **DID Management**: Register, update, and revoke DIDs
- **Verifiable Credentials**: Issue, revoke, and verify credentials on-chain
- **Access Control**: Owner-based permissions for DID operations
- **Event Logging**: Comprehensive event emission for all operations

## 🚀 Deployed Contract

- **Network**: Sepolia Testnet
- **Contract Address**: `0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75`
- **Deployer**: `0x33ef1e7a3EF6787EBb7C6f2a3A75e6dD5ab5B043`
- **Block Number**: 9373465
- **Etherscan**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75)

## 🏗️ Contract Architecture

### Core Components

1. **DIDDocument Structure**
   ```solidity
   struct DIDDocument {
       string id;           // DID identifier
       address owner;       // Ethereum address of owner
       string[] publicKeys; // Array of public keys
       string[] services;   // Array of service endpoints
       uint256 created;     // Creation timestamp
       uint256 updated;     // Last update timestamp
       bool exists;         // Existence flag
       bool revoked;        // Revocation status
   }
   ```

2. **VerifiableCredential Structure**
   ```solidity
   struct VerifiableCredential {
       string credentialId;     // Unique credential identifier
       string subjectDID;       // DID of credential subject
       string issuerDID;        // DID of credential issuer
       string credentialType;   // Type of credential
       string credentialData;   // JSON credential data
       uint256 issuanceDate;    // Issuance timestamp
       uint256 expirationDate;  // Expiration timestamp
       bool revoked;            // Revocation status
       bytes signature;         // Issuer signature
   }
   ```

### Key Functions

#### DID Management
- `registerDID(string didId, string[] publicKeys, string[] services)`
- `updateDID(string didId, string[] publicKeys, string[] services)`
- `revokeDID(string didId)`
- `getDIDDocument(string didId)` - View function
- `isDIDValid(string didId)` - View function

#### Credential Management
- `issueCredential(...)` - Issue a new verifiable credential
- `revokeCredential(string credentialId)` - Revoke an existing credential
- `getCredential(string credentialId)` - View function
- `verifyCredential(string credentialId, bytes32 message)` - View function

#### Utility Functions
- `getDIDsByOwner(address owner)` - Get all DIDs owned by an address
- `getCredentialsForDID(string didId)` - Get all credentials for a DID

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartContracts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   ```env
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   DID_REGISTRY_ADDRESS=0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75
   ```

### Compilation

```bash
npx hardhat compile
```

### Testing

```bash
npx hardhat test
```

### Deployment

Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Deploy to local network:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

## 🔧 Usage Examples

### JavaScript/TypeScript Integration

```javascript
const { ethers } = require("ethers");

// Contract ABI (simplified)
const DID_REGISTRY_ABI = [
  "function registerDID(string memory didId, string[] memory publicKeys, string[] memory services) external",
  "function getDIDDocument(string memory didId) external view returns (tuple(string id, address owner, string[] publicKeys, string[] services, uint256 created, uint256 updated, bool exists, bool revoked))",
  "function issueCredential(string memory credentialId, string memory subjectDID, string memory issuerDID, string memory credentialType, string memory credentialData, uint256 expirationDate, bytes memory signature) external"
];

// Connect to contract
const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_PROJECT_ID");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
const contract = new ethers.Contract("0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75", DID_REGISTRY_ABI, wallet);

// Register a DID
async function registerDID() {
  const didId = `did:ethr:sepolia:${wallet.address}`;
  const publicKeys = [wallet.publicKey];
  const services = ["https://example.com/service"];
  
  const tx = await contract.registerDID(didId, publicKeys, services);
  await tx.wait();
  console.log("DID registered:", didId);
}

// Issue a credential
async function issueCredential() {
  const credentialId = "credential-123";
  const subjectDID = "did:ethr:sepolia:0x...";
  const issuerDID = `did:ethr:sepolia:${wallet.address}`;
  const credentialType = "UniversityDegree";
  const credentialData = JSON.stringify({
    degree: "Bachelor of Science",
    university: "Example University"
  });
  const expirationDate = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 year
  const signature = await wallet.signMessage(credentialData);
  
  const tx = await contract.issueCredential(
    credentialId, subjectDID, issuerDID, 
    credentialType, credentialData, expirationDate, signature
  );
  await tx.wait();
  console.log("Credential issued:", credentialId);
}
```

## 📊 Gas Costs

| Operation | Estimated Gas | Cost (10 gwei) |
|-----------|---------------|-----------------|
| Register DID | ~150,000 | ~0.0015 ETH |
| Update DID | ~100,000 | ~0.001 ETH |
| Revoke DID | ~50,000 | ~0.0005 ETH |
| Issue Credential | ~200,000 | ~0.002 ETH |
| Revoke Credential | ~50,000 | ~0.0005 ETH |

## 🔒 Security Features

### Access Control
- Only DID owners can update or revoke their DIDs
- Only authorized issuers can issue credentials for their DIDs
- Contract owner has administrative privileges

### Validation
- DID existence checks before operations
- Expiration date validation for credentials
- Signature verification for credentials
- Duplicate prevention for DIDs and credentials

### Events
All operations emit events for transparency:
- `DIDRegistered(string indexed didId, address indexed owner, uint256 timestamp)`
- `DIDUpdated(string indexed didId, address indexed owner, uint256 timestamp)`
- `DIDRevoked(string indexed didId, address indexed owner, uint256 timestamp)`
- `CredentialIssued(string indexed credentialId, string indexed subjectDID, string indexed issuerDID)`
- `CredentialRevoked(string indexed credentialId, string indexed issuerDID)`

## 🧪 Testing

The contract includes comprehensive tests covering:

- DID registration, updates, and revocation
- Verifiable credential issuance and revocation
- Access control mechanisms
- Edge cases and error conditions

Run tests:
```bash
npm test
```

Generate coverage report:
```bash
npx hardhat coverage
```

## 📁 Project Structure

```
SmartContracts/
├── contracts/
│   └── DIDRegistry.sol          # Main DID Registry contract
├── scripts/
│   ├── deploy.js               # Deployment script
│   └── verify-deployment.js    # Verification script
├── test/
│   └── DIDRegistry.test.js     # Contract tests
├── hardhat.config.js           # Hardhat configuration
├── package.json               # Dependencies
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🌐 Network Configuration

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **Block Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepoliafaucet.com/

### Local Development
- **Chain ID**: 31337
- **RPC URL**: http://127.0.0.1:8545
- **Start local node**: `npx hardhat node`

## 🔍 Contract Verification

Verify the contract on Etherscan:
```bash
npx hardhat verify --network sepolia 0x8e9AC2Cb14b6b07D31FAF803D8B6Bac6cDC75B75
```

## 🤝 Integration with DID Services

This smart contract is designed to work with the DID ecosystem services:

- **Wallet Service** (Port 3001): DID registration and management
- **Issuer Service** (Port 3002): Credential issuance
- **Verifier Service** (Port 3003): Credential verification

## 📚 Standards Compliance

This implementation follows:
- [W3C DID Core Specification](https://www.w3.org/TR/did-core/)
- [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/)
- [EIP-1056: Ethereum DID Registry](https://eips.ethereum.org/EIPS/eip-1056)

## 🔗 Useful Links

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

For questions or issues:
1. Check the [Issues](https://github.com/knix008/Smart-Contract/issues) page
2. Review the test files for usage examples
3. Consult the W3C DID specifications

---

**⚠️ Disclaimer**: This smart contract is for educational and development purposes. Conduct thorough security audits before production use.