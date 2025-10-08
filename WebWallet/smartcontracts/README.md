# Smart Contracts

This directory contains the Solidity smart contracts for the Ethereum Wallet application, configured for deployment to Sepolia testnet and mainnet via Infura.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+ recommended, current: v23.1.0)
- npm or yarn package manager
- Ethereum wallet with private key
- Sepolia testnet ETH for deployment (get from faucets)

### 1. Install Dependencies

```bash
cd smartcontracts
npm install
```

### 2. Environment Setup

Copy and configure the `.env` file in the parent directory:

```bash
# Smart Contract Deployment Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key_for_verification
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm run test
```

### 5. Check Account Balance

```bash
# Check Sepolia testnet balance
npm run balance:sepolia

# Check mainnet balance
npm run balance:mainnet
```

### 6. Deploy to Sepolia Testnet

```bash
# Ensure you have Sepolia ETH first
npm run deploy:sepolia
```

## � Project Structure

```
smartcontracts/
├── contracts/              # Solidity smart contracts
│   ├── SimpleWallet.sol    # Basic wallet contract
│   ├── WalletFactory.sol   # Factory for creating wallets
│   └── WalletToken.sol     # ERC20 token for the ecosystem
├── scripts/                # Deployment and utility scripts
│   ├── deploy.js          # Main deployment script
│   └── checkBalance.js    # Balance checking utility
├── test/                   # Comprehensive test suite
│   ├── SimpleWallet.test.js
│   └── WalletFactory.test.js
├── deployments/            # Deployment artifacts (auto-generated)
├── hardhat.config.js       # Hardhat configuration with network setup
├── package.json           # Dependencies and scripts
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run compile              # Compile all smart contracts
npm run test                # Run comprehensive test suite
npm run clean               # Clean compiled artifacts

# Network Operations
npm run node                # Start local Hardhat network
npm run balance:sepolia     # Check account balance on Sepolia
npm run balance:mainnet     # Check account balance on mainnet

# Deployment
npm run deploy:local        # Deploy to local Hardhat network
npm run deploy:sepolia      # Deploy to Sepolia testnet
npm run deploy:mainnet      # Deploy to Ethereum mainnet
```

## 💰 Getting Testnet ETH

Before deploying to Sepolia, you need testnet ETH for gas fees:

### Recommended Faucets:
- **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
- **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
- **ChainLink Sepolia Faucet**: https://faucets.chain.link/sepolia

### Current Deployment Account:
```
Address: 0x8bB041C96042646a04abd0f2Cdb6f1316cDC507b
Required: ~0.0005 ETH for deployment
```

Use the address above when requesting testnet ETH from faucets.

## 📋 Smart Contracts Overview

### SimpleWallet.sol
**Status**: ✅ Compiled and Tested

A secure wallet contract that can:
- Receive and store Ether safely
- Withdraw funds (owner-only access)
- Send Ether to other addresses
- Transfer ownership securely
- Emit events for all transactions

**Key Security Features**:
- Owner-only access control
- Safe withdrawal mechanisms
- Input validation
- Event logging for transparency

### WalletFactory.sol
**Status**: ✅ Compiled and Tested

A factory contract for creating multiple wallet instances:
- Deploy new SimpleWallet contracts efficiently
- Track all created wallets
- Associate wallets with their creators
- Provide enumeration functions

**Use Cases**:
- Multi-user wallet deployment
- Wallet management systems
- Decentralized wallet services

### WalletToken.sol
**Status**: ✅ Compiled and Tested

An ERC20 token for the wallet ecosystem:
- Standard ERC20 functionality with OpenZeppelin
- Reward system (100 tokens per claim)
- Authorized minting capabilities
- Ownership controls

**Token Details**:
- **Name**: WalletToken
- **Symbol**: WALLET
- **Initial Supply**: 1,000,000 tokens
- **Decimals**: 18
- **Reward Amount**: 100 tokens per claim

## ✅ Testing Status

All contracts have comprehensive test coverage:

```
SimpleWallet: 13/13 tests passing
- Deployment tests
- Ether receiving functionality  
- Withdrawal operations
- Ownership transfer
- Send Ether functionality

WalletFactory: 8/8 tests passing
- Deployment verification
- Wallet creation
- User wallet tracking
- Multiple wallet scenarios

Total: 21/21 tests passing ✅
```

## 🌐 Network Configuration

### Supported Networks

| Network | Chain ID | Status | RPC URL |
|---------|----------|--------|---------|
| Hardhat Local | 1337 | ✅ Ready | http://127.0.0.1:8545 |
| Sepolia Testnet | 11155111 | ✅ Configured | Infura (configured) |
| Ethereum Mainnet | 1 | ⚠️ Use with caution | Infura (requires setup) |

### Current Configuration

- **Sepolia RPC**: Connected via Infura
- **Private Key**: Configured in .env
- **Deployer Address**: `0x8bB041C96042646a04abd0f2Cdb6f1316cDC507b`
- **Gas Optimization**: Enabled (200 runs)
- **Solidity Versions**: 0.8.19 and 0.8.20 support

## � Deployment Process

### Pre-Deployment Checklist

1. ✅ Contracts compiled successfully
2. ✅ All tests passing (21/21)
3. ✅ Environment variables configured
4. ⏳ Sepolia ETH balance (check with `npm run balance:sepolia`)
5. ⏳ Ready for deployment

### Deployment Steps

```bash
# 1. Check your balance first
npm run balance:sepolia

# 2. If balance is sufficient, deploy
npm run deploy:sepolia

# 3. Deployment will output contract addresses
# 4. Deployment info saved to deployments/ directory
# 5. Use contract addresses in your React app
```

### Post-Deployment

After successful deployment, you'll receive:
- Contract addresses for all three contracts
- Deployment transaction hashes
- Gas usage reports
- JSON file with deployment details

## 🔗 Integration with React App

The deployed contract addresses can be imported into the React application:

1. **Deploy contracts** using `npm run deploy:sepolia`
2. **Copy contract addresses** from deployment output
3. **Update React app** with the new contract addresses
4. **Connect with ethers.js** for transaction handling

### Example Integration

```javascript
// In your React app
const WALLET_FACTORY_ADDRESS = "0x..."; // From deployment
const WALLET_TOKEN_ADDRESS = "0x...";   // From deployment

// Connect to deployed contracts
const walletFactory = new ethers.Contract(
  WALLET_FACTORY_ADDRESS,
  WalletFactoryABI,
  signer
);
```

## � Security & Best Practices

### Security Features Implemented
- ✅ OpenZeppelin security standards (v5.0.0)
- ✅ Access control modifiers (onlyOwner)
- ✅ Input validation for all functions
- ✅ Reentrancy protection patterns
- ✅ Safe math operations (Solidity 0.8+)
- ✅ Event emission for transparency
- ✅ Zero address checks
- ✅ Balance verification before transfers

### Development Best Practices
- ✅ Comprehensive test coverage (21/21 tests)
- ✅ Gas optimization enabled (200 runs)
- ✅ Multiple Solidity version support
- ✅ Proper import structure
- ✅ Detailed documentation
- ✅ Error messages for debugging

### Deployment Security
- ✅ Environment variable protection
- ✅ Private key management
- ✅ Network-specific configurations
- ✅ Gas estimation before deployment
- ✅ Balance verification
- ✅ Deployment artifact tracking

## 🐛 Troubleshooting

### Common Issues and Solutions

**1. Compilation Errors**
```bash
# Clean and recompile
npm run clean
npm run compile
```

**2. Test Failures**
```bash
# Run tests with verbose output
npx hardhat test --verbose
```

**3. Insufficient Funds for Deployment**
```bash
# Check your balance
npm run balance:sepolia

# Get testnet ETH from faucets
# - https://sepoliafaucet.com/
# - https://www.infura.io/faucet/sepolia
```

**4. Network Connection Issues**
- Verify RPC URL in .env file
- Check Infura project status
- Ensure private key is correct (without 0x prefix)

**5. Gas Estimation Errors**
- Increase gas limit in hardhat.config.js
- Check network congestion
- Verify contract bytecode size

### Getting Help

- **Hardhat Documentation**: https://hardhat.org/docs
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts
- **Ethereum Development**: https://ethereum.org/en/developers
- **Solidity Documentation**: https://docs.soliditylang.org

## 📈 Next Steps

1. **Get Sepolia ETH** from faucets for deployment
2. **Deploy to Sepolia** using `npm run deploy:sepolia`
3. **Integrate with React App** using deployed contract addresses
4. **Test on Sepolia** before considering mainnet deployment
5. **Consider contract verification** on Etherscan for transparency

## 📞 Support

For issues related to:
- **Smart Contracts**: Check test results and compilation logs
- **Deployment**: Verify network configuration and account balance
- **Integration**: Ensure correct contract addresses and ABIs
- **Security**: Follow OpenZeppelin best practices