# 🚀 Ethereum Web Wallet

A comprehensive web-based Ethereum wallet with smart contract compilation, deployment, and interaction capabilities. Features automated `.env` configuration loading, contract interaction tools, and comprehensive testing infrastructure.

## ✨ Features

### 💳 Wallet Management
- **Create New Ethereum Account** - Generate secure wallets with one click
- **ETH Balance Checking** - Real-time balance display with network information
- **Credential Management** - Secure private key handling and address display
- **Copy & Download** - Easy clipboard copy and `.env` file generation
- **Multi-Network Support** - Sepolia testnet, Ethereum mainnet, and custom RPCs

### 🔧 Smart Contract Tools
- **Local Compilation** - Compile Solidity contracts with OpenZeppelin support
- **Multi-Network Deployment** - Deploy to any network with custom RPC URLs
- **Contract Interaction** - Full contract interaction interface with balance checking
- **Constructor Arguments** - Complete support for parameterized deployments
- **Gas Estimation** - Real-time gas cost calculations and optimization

### ⚙️ Configuration Management
- **Automated .env Loading** - Auto-populate all fields from environment variables
- **Network Selection** - Pre-configured networks with custom RPC support
- **Private Key Integration** - Secure credential management from `.env` files
- **Contract Address Management** - Persistent contract address storage

### 🧪 Testing Infrastructure
- **Comprehensive Test Suite** - Complete testing framework for accounts and contracts
- **Account Validation** - Balance checking and network connectivity tests
- **Contract Testing** - Deployed contract interaction and function call tests
- **Network Health Checks** - RPC connectivity and performance monitoring
- **Deployment Readiness** - Pre-deployment validation and gas estimation

## 🚀 Quick Start

### 1. Installation

```bash
# Clone and install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file with your configuration:

```env
# Account Configuration
ACCOUNT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
PRIVATE_KEY=0x1234...

# Network Configuration  
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
DEFAULT_NETWORK=sepolia

# Contract Configuration (after deployment)
CONTRACT_ADDRESS=0xabcd...

# Constructor Arguments
MYTOKEN_INITIAL_OWNER=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
SIMPLETOKEN_NAME=MyToken
SIMPLETOKEN_SYMBOL=MTK
SIMPLETOKEN_INITIAL_SUPPLY=1000000
```

### 3. Start the Application

```bash
# Start web server
npm run serve

# Open browser to http://localhost:8080
```

## 🛠️ Development Workflow

### Smart Contract Development

```bash
# 1. Compile contracts
npm run compile:erc20      # Compile MyERC20Token
npm run compile:simple     # Compile SimpleToken

# 2. Test your setup
npm run test               # Run all tests
npm run test:account       # Test account balance
npm run test:network       # Test RPC connectivity

# 3. Deploy contracts
npm run deploy             # Deploy to configured network
npm run deploy:sepolia     # Deploy specifically to Sepolia

# 4. Validate deployment
npm run test:contract      # Test deployed contract interaction

# 5. Interact with contracts
npm run interact           # Command-line contract interaction
```

## 📱 Web Interface Usage

### Tab 1: Create Wallet
1. **Auto-loaded Configuration** - Fields automatically populate from `.env` file
2. **Create New Account** - Generate secure Ethereum wallet
3. **Check ETH Balance** - Real-time balance checking with network info
4. **Download Credentials** - Save wallet data to `.env` file format

### Tab 2: Deploy Contract
1. **Network Selection** - Choose from pre-configured networks or custom RPC
2. **Contract Upload** - Load compiled contracts from `compiled/` directory
3. **Constructor Configuration** - Auto-filled from `.env` file
4. **Deploy & Verify** - One-click deployment with transaction tracking

### Tab 3: Interact with Contract
1. **Contract Connection** - Automatic connection using `CONTRACT_ADDRESS` from `.env`
2. **Balance Checking** - Check both ETH and token balances
3. **Contract Functions** - Call read functions (name, symbol, totalSupply)
4. **Transaction History** - Track all contract interactions

## 🧪 Testing Framework

### Available Tests

```bash
npm run test                # Run complete test suite
npm run test:account        # Test account balance and network
npm run test:contract       # Test deployed contract interaction
npm run test:deployment     # Test deployment readiness
npm run test:network        # Test RPC connectivity and performance
```

### Test Coverage
- ✅ **Account Validation** - Balance, network connectivity, gas prices
- ✅ **Network Health** - RPC response times, chain ID verification
- ✅ **Contract Interaction** - ABI loading, function calls, transaction estimation
- ✅ **Deployment Readiness** - Balance sufficiency, gas estimation, compilation check

## 📁 Project Structure

```
WebWallet/
├── index.html              # Main web application
├── package.json            # Dependencies and scripts
├── .env                    # Environment configuration
├── deploy-mytoken.js       # MyToken deployment script
├── deploy-simpletoken.js   # SimpleToken deployment script
├── interact-contract.js    # CLI contract interaction tool
├── compiled/               # Compiled contract artifacts
│   ├── MyToken.json        # MyERC20Token compilation output
│   └── SimpleToken.json    # SimpleToken compilation output
├── scripts/                # Utility scripts
│   └── compile.js          # Contract compilation script
├── SmartContract/          # Solidity source files
│   └── contacts/
│       ├── MyERC20Token.sol
│       └── SimpleToken.sol
└── test/                   # Testing infrastructure
    ├── README.md           # Testing documentation
    ├── test-all.js         # Master test suite
    ├── test-account.js     # Account testing
    ├── test-contract.js    # Contract testing
    ├── test-deployment.js  # Deployment testing
    └── test-network.js     # Network testing
```

## 🔐 Security Features

### Private Key Management
- **Environment Variables** - Secure storage in `.env` files
- **Browser Security** - No private key exposure in web interface
- **Git Protection** - `.gitignore` prevents accidental commits
- **Local Processing** - All operations happen locally

### Network Security
- **RPC URL Validation** - Secure connection verification
- **Transaction Simulation** - Gas estimation before execution
- **Balance Validation** - Insufficient balance warnings
- **Network Verification** - Chain ID and network name validation

## 📚 Advanced Features

### Custom Network Configuration
```env
# Add any custom network
RPC_URL=https://your-custom-rpc.com
DEFAULT_NETWORK=custom
```

### Multi-Contract Support
```bash
# Deploy different contracts
npm run deploy              # Deploy MyERC20Token
npm run deploy:simple       # Deploy SimpleToken

# Test different contracts
CONTRACT_ADDRESS=0x... npm run test:contract
```

### Development Scripts
```bash
# Compilation
npm run compile             # Compile all contracts
node scripts/compile.js SmartContract/contacts/YourContract.sol

# Deployment with environment override
NETWORK=sepolia npm run deploy
RPC_URL=http://localhost:8545 npm run deploy:local

# Contract interaction
npm run interact            # CLI-based contract interaction
```

## 🛠️ Development Tools

### Available NPM Scripts
```json
{
  "compile": "Compile all contracts",
  "compile:erc20": "Compile MyERC20Token", 
  "compile:simple": "Compile SimpleToken",
  "deploy": "Deploy MyToken to configured network",
  "deploy:sepolia": "Deploy specifically to Sepolia",
  "interact": "CLI contract interaction tool",
  "serve": "Start local web server",
  "test": "Run all tests",
  "test:account": "Test account functionality",
  "test:contract": "Test contract interaction", 
  "test:deployment": "Test deployment readiness",
  "test:network": "Test network connectivity"
}
```

### Environment Variables Reference
```env
# Required for all operations
ACCOUNT_ADDRESS=0x...       # Your Ethereum address
PRIVATE_KEY=0x...          # Your private key (keep secure!)
RPC_URL=https://...        # RPC endpoint URL

# Optional network configuration
DEFAULT_NETWORK=sepolia    # Default network name

# Contract address (set after deployment)
CONTRACT_ADDRESS=0x...     # Deployed contract address

# Constructor arguments for MyERC20Token
MYTOKEN_INITIAL_OWNER=0x...

# Constructor arguments for SimpleToken
SIMPLETOKEN_NAME=MyToken
SIMPLETOKEN_SYMBOL=MTK
SIMPLETOKEN_INITIAL_SUPPLY=1000000
```

## 🚨 Troubleshooting

### Common Issues

1. **"RPC_URL not found"**
   ```bash
   # Add to .env file
   echo "RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID" >> .env
   ```

2. **"No contract at address"**
   ```bash
   # Deploy contract first
   npm run deploy
   # Update CONTRACT_ADDRESS in .env
   ```

3. **"Insufficient balance"**
   - Get testnet ETH from faucets:
     - https://faucets.chain.link/sepolia
     - https://sepoliafaucet.com

4. **Compilation errors**
   ```bash
   # Install dependencies
   npm install
   # Check Solidity version compatibility
   ```

### Debug Mode
```bash
# Enable detailed logging
DEBUG=true npm run test
DEBUG=true npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Resources

- [ethers.js Documentation](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- [Sepolia Testnet Faucets](https://faucets.chain.link/sepolia)
- [Solidity Documentation](https://docs.soliditylang.org/)

---

**⚠️ Security Notice:** Never share your private keys or commit `.env` files to version control. This application is for development and testing purposes.
