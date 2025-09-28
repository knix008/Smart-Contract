# MyERC20Token Smart Contract

A comprehensive ERC20 token implementation using OpenZeppelin contracts, deployed on Kurtosis Ethereum network with full testing capabilities.

## 📋 Overview

This project contains a basic ERC20 token contract (`MyERC20Token`) with the following features:
- **Name**: MyERC20Token
- **Symbol**: MTK
- **Decimals**: 18
- **Total Supply**: 1,000 MTK
- **Initial Recipient**: Deployer receives all tokens

## 🏗️ Contract Features

- **ERC20 Standard**: Implements the standard ERC20 token interface
- **ERC20Permit**: Includes permit functionality for gasless approvals
- **OpenZeppelin**: Built on top of OpenZeppelin's secure and audited contracts
- **Mint on Deploy**: Automatically mints 1,000 tokens to the deployer

## 🛠️ Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- Git

## 📦 Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd SmartContract
   ```

2. **Install dependencies**:
   ```bash
   npm install
```

## 🚀 Quick Start

### 1. Prerequisites

Ensure the Kurtosis network is running:
```bash
# From the main Ethereum directory
./start-network.sh
```

### 2. Test Your Contract

The contract is already deployed and ready for testing:

```bash
# Basic contract test
npm run simple-test

# Comprehensive interaction test
npm run interact

# Direct RPC test (no Hardhat required)
npm run web3-test
```

### 3. Deploy to Kurtosis Network (if needed)

```bash
# Deploy to Kurtosis network
npx hardhat run scripts/deploy.js --network kurtosis
```

## 📁 Project Structure

```
SmartContract/
├── contracts/
│   └── MyERC20Token.sol          # Main ERC20 token contract
├── scripts/
│   ├── deploy.js                 # Deployment script
│   ├── interact.js               # Comprehensive interaction script
│   ├── simple-test.js            # Basic contract test
│   └── web3-test.js              # Direct RPC test
├── deployments/                  # Deployment information
│   └── deployment-*.json         # Deployment details
├── hardhat.config.js             # Hardhat configuration
├── package.json                  # Dependencies and scripts
├── TEST_SCRIPTS.md               # Test scripts documentation
└── README.md                     # This file
```

## 🔧 Available Scripts

### Development Scripts
- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy to Kurtosis network
- `npm run test` - Run tests (if any)

### Testing Scripts
- `npm run simple-test` - Basic contract functionality test
- `npm run interact` - Comprehensive ERC20 + ERC20Permit test
- `npm run web3-test` - Direct RPC connection test

### Hardhat Commands
- `npx hardhat console --network kurtosis` - Open Hardhat console
- `npx hardhat run scripts/deploy.js --network kurtosis` - Deploy contract

## 🌐 Network Configuration

### Kurtosis Network (Current)
- **RPC URL**: `http://127.0.0.1:32800`
- **Chain ID**: `585858`
- **Block Explorer**: `http://127.0.0.1:32826` (Dora)
- **Network Type**: Private Ethereum network with multiple nodes

### Network Access Points
- **Node 1**: `http://127.0.0.1:32800` (Primary RPC)
- **Node 2**: `http://127.0.0.1:32810`
- **Node 3**: `http://127.0.0.1:32805`
- **WebSocket**: `ws://127.0.0.1:32801`

### Pre-funded Accounts
The Kurtosis network provides pre-funded accounts:
- Account #0: `0xAe95d8DA9244C37CaC0a3e16BA966a8e852Bb6D6` (Deployer)
- Account #1: `0x7ff1a4c1d57e5e784d327c4c7651e952350bc271f156afb3d00d20f5ef924856`
- Account #2: `0x3a91003acaf4c21b3953d94fa4a6db694fa69e5242b2e37be05dd82761058899`

## 📊 Contract Information

### Deployment Details
- **Contract Address**: `0x78C9506af12dEc8bf37a91b2dadE16D07Ff39Dd2`
- **Deployer**: `0xAe95d8DA9244C37CaC0a3e16BA966a8e852Bb6D6`
- **Transaction Hash**: `0x7ea46ae9260d6703ff8c60f844e28e27f0cfad852a3b4e1f4866ae90c3e0ece4`
- **Block Number**: 92
- **Network**: Kurtosis Ethereum (Chain ID: 585858)

### Token Details
- **Name**: MyERC20Token
- **Symbol**: MTK
- **Decimals**: 18
- **Total Supply**: 1,000 MTK
- **Deployer Balance**: 990 MTK (after test transfers)
- **Current Block**: 272+

## 🔍 Contract Functions

### View Functions
- `name()` - Returns token name
- `symbol()` - Returns token symbol
- `decimals()` - Returns token decimals
- `totalSupply()` - Returns total supply
- `balanceOf(address)` - Returns balance of address

### State-Changing Functions
- `transfer(address to, uint256 amount)` - Transfer tokens
- `approve(address spender, uint256 amount)` - Approve spending
- `transferFrom(address from, address to, uint256 amount)` - Transfer from approved account

## 🧪 Testing

### Automated Test Scripts

The project includes comprehensive test scripts for different use cases:

#### 1. Basic Contract Test
```bash
npm run simple-test
```
**Features:**
- Tests basic contract functionality
- Shows token information and balances
- Tests transfer operations
- Uses Hardhat framework

#### 2. Comprehensive Interaction Test
```bash
npm run interact
```
**Features:**
- Tests all ERC20 standard functions
- Tests ERC20Permit functionality
- Shows recent events and network info
- Comprehensive error handling

#### 3. Direct RPC Test
```bash
npm run web3-test
```
**Features:**
- Direct web3.js connection to Kurtosis network
- No Hardhat dependency required
- Shows contract creation details
- Tests contract ABI interaction

### Manual Testing

#### Hardhat Console
```bash
npx hardhat console --network kurtosis
```

Then in the console:
```javascript
// Get contract instance
const contract = await ethers.getContractAt("MyERC20Token", "0x78C9506af12dEc8bf37a91b2dadE16D07Ff39Dd2");

// Check balance
const balance = await contract.balanceOf("0xAe95d8DA9244C37CaC0a3e16BA966a8e852Bb6D6");
console.log("Balance:", ethers.formatEther(balance), "MTK");
```

### Test Results Summary
- ✅ **Contract Name**: MyERC20Token
- ✅ **Symbol**: MTK
- ✅ **Total Supply**: 1,000 MTK
- ✅ **Deployer Balance**: 990 MTK
- ✅ **Transfer Functionality**: Working
- ✅ **Event Logging**: Active
- ✅ **Network Connection**: Stable

## 📝 Deployment Information

Deployment information is automatically saved to the `deployments/` directory in JSON format, including:
- Contract address
- Deployer address
- Transaction hash
- Block number
- Timestamp
- Contract details

## 🔒 Security Notes

⚠️ **Important**: The private keys shown in the Hardhat node output are publicly known and should **NEVER** be used on mainnet or any live network. They are only for local development and testing.

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot connect to network"**
   - Make sure the Kurtosis network is running: `./start-network.sh`
   - Check the RPC URL in `hardhat.config.js` (should be `http://127.0.0.1:32800`)
   - Verify network status: `./network-status.sh`

2. **"Sender doesn't have enough funds"**
   - Ensure you're using the Kurtosis network accounts
   - Check that the Kurtosis network is running and funded
   - Verify account balance in test scripts

3. **"Module not found" errors**
   - Run `npm install` to install dependencies
   - Make sure `@nomicfoundation/hardhat-toolbox` and `web3` are installed

4. **Test scripts failing**
   - Ensure Kurtosis network is running
   - Check that the contract is deployed
   - Verify the contract address in scripts

### Network Issues

1. **Kurtosis network not starting**
   ```bash
   # Check Docker status
   docker info
   
   # Stop and restart Kurtosis
   ./stop-network.sh
   ./start-network.sh
   ```

2. **Block explorer not accessible**
   - Check Dora explorer: `http://127.0.0.1:32826`
   - Check Blockscout: `http://127.0.0.1:3000`
   - Use `./network-status.sh` for current port mappings

### Node.js Version Warning
If you see warnings about Node.js version, consider using Node.js v16 or v18 for better compatibility with Hardhat.

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [ERC20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Ethereum Development](https://ethereum.org/developers/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Coding! 🚀**