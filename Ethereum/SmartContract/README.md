# MyERC20Token Smart Contract

A simple ERC20 token implementation using OpenZeppelin contracts, deployed on a local Ethereum network using Hardhat.

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

### 1. Start Local Network

Start a local Hardhat node:
```bash
npx hardhat node
```

This will start a local Ethereum network on `http://127.0.0.1:8545` with 20 pre-funded accounts.

### 2. Deploy Contract

In a new terminal, deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Interact with Contract

To interact with a deployed contract:
```bash
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3 npx hardhat run scripts/interact.js --network localhost
```

## 📁 Project Structure

```
SmartContract/
├── contracts/
│   └── MyERC20Token.sol          # Main ERC20 token contract
├── scripts/
│   ├── deploy.js                 # Deployment script
│   └── interact.js               # Interaction script
├── deployments/                  # Deployment information
│   └── deployment-*.json         # Deployment details
├── hardhat.config.js             # Hardhat configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🔧 Available Scripts

- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy to localhost network
- `npm run test` - Run tests (if any)
- `npx hardhat node` - Start local network
- `npx hardhat console` - Open Hardhat console

## 🌐 Network Configuration

### Localhost Network
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Accounts**: 20 pre-funded accounts with 10,000 ETH each

### Default Accounts
The local network provides 20 pre-funded accounts:
- Account #0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (Deployer)
- Account #1: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Account #2: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- ... and 17 more accounts

## 📊 Contract Information

### Deployment Details
- **Contract Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Deployer**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Transaction Hash**: `0xb885a3baa7922d31b639148ee3970623d1a3fca0a83c89318475e17540d5a099`
- **Block Number**: 1

### Token Details
- **Name**: MyERC20Token
- **Symbol**: MTK
- **Decimals**: 18
- **Total Supply**: 1,000 MTK
- **Deployer Balance**: 1,000 MTK

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

### Manual Testing
1. Start the local network: `npx hardhat node`
2. Deploy the contract: `npx hardhat run scripts/deploy.js --network localhost`
3. Interact with the contract using the interaction script

### Console Testing
```bash
npx hardhat console --network localhost
```

Then in the console:
```javascript
// Get contract instance
const contract = await ethers.getContractAt("MyERC20Token", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

// Check balance
const balance = await contract.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
console.log("Balance:", ethers.formatEther(balance), "MTK");
```

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
   - Make sure the Hardhat node is running: `npx hardhat node`
   - Check the RPC URL in `hardhat.config.js`

2. **"Sender doesn't have enough funds"**
   - Ensure you're using the default Hardhat accounts
   - Check that the local network is running

3. **"Module not found" errors**
   - Run `npm install` to install dependencies
   - Make sure `@nomicfoundation/hardhat-toolbox` is installed

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