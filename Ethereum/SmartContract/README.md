# ERC-20 Smart Contract for Private Ethereum Network

This project contains a complete ERC-20 token implementation and deployment scripts for your private Ethereum PoS network.

## 🚀 Features

- **Standard ERC-20 Implementation**: Full compliance with ERC-20 token standard
- **Additional Features**: Minting, burning, and enhanced functionality
- **Easy Deployment**: Automated deployment to your private network
- **Comprehensive Testing**: Full test suite for all token functions
- **Interactive Demo**: Live interaction examples with the deployed contract

## 📁 Project Structure

```
SmartContract/
├── MyToken.sol          # ERC-20 smart contract
├── deploy.js            # Deployment script
├── interact.js          # Interaction script
├── test.js              # Test suite
├── package.json         # Node.js dependencies
├── README.md            # This file
├── build/               # Compiled contracts (auto-generated)
│   └── MyToken.json     # Contract ABI and bytecode
├── deployment.json      # Deployment information (auto-generated)
└── test-results.json    # Test results (auto-generated)
```

## 🛠️ Setup

### Prerequisites

1. **Node.js** (version 16 or higher)
2. **Private Ethereum Network** running (see main README.md)
3. **Funded Accounts** for deployment and testing

### Installation

1. **Install dependencies:**
   ```bash
   cd SmartContract
   npm install
   ```

2. **Ensure your private network is running:**
   ```bash
   cd ..
   ./manage-network.sh status
   ```

## 🚀 Usage

### 1. Deploy the Contract

Deploy the ERC-20 token to your private network:

```bash
npm run deploy
```

This will:
- Compile the smart contract
- Deploy it to your private network (Node 1)
- Verify the deployment
- Save deployment information

### 2. Test the Contract

Run the comprehensive test suite:

```bash
npm run test
```

Tests include:
- ✅ Token information verification
- ✅ Balance checking
- ✅ Token transfers
- ✅ Approval mechanism
- ✅ Minting functionality
- ✅ Burning functionality

### 3. Interact with the Contract

Run the interactive demo:

```bash
npm run interact
```

This demonstrates:
- 📊 Token information retrieval
- 💰 Balance checking
- 💸 Token transfers
- 🔐 Approval system
- 🪙 Token minting

### 4. Manual Scripts

You can also run scripts directly:

```bash
# Deploy
node deploy.js

# Test
node test.js

# Interact
node interact.js
```

## 📋 Token Configuration

The token is configured with:

- **Name**: My Private Token
- **Symbol**: MPT
- **Decimals**: 18
- **Initial Supply**: 1,000,000 tokens
- **Owner**: Deployer account

## 🔧 Customization

### Modify Token Parameters

Edit the `CONFIG` object in `deploy.js`:

```javascript
const CONFIG = {
    TOKEN_NAME: 'My Custom Token',
    TOKEN_SYMBOL: 'MCT',
    TOKEN_DECIMALS: 18,
    INITIAL_SUPPLY: 5000000, // 5 million tokens
    // ... other settings
};
```

### Add Custom Functions

Extend the `MyToken.sol` contract with additional functionality:

```solidity
// Example: Add a custom function
function customFunction() public view returns (string memory) {
    return "Custom functionality";
}
```

## 📊 Contract Functions

### Standard ERC-20 Functions

- `transfer(address to, uint256 amount)` - Transfer tokens
- `transferFrom(address from, address to, uint256 amount)` - Transfer from allowance
- `approve(address spender, uint256 amount)` - Approve spender
- `balanceOf(address account)` - Get account balance
- `allowance(address owner, address spender)` - Get allowance

### Additional Functions

- `mint(address to, uint256 amount)` - Mint new tokens (owner only)
- `burn(uint256 amount)` - Burn tokens from caller
- `burnFrom(address from, uint256 amount)` - Burn tokens from account (owner only)
- `getTokenInfo()` - Get complete token information
- `getAccountInfo(address account, address spender)` - Get account details

## 🌐 Network Configuration

The contract is configured to work with your private network:

- **RPC URL**: `http://localhost:8545` (Node 1)
- **Chain ID**: 1337
- **Gas Price**: 20 Gwei
- **Gas Limit**: Auto-estimated with buffer

### Multiple Node Support

You can deploy to different nodes by changing the RPC URL:

```javascript
// Node 1 (default)
RPC_URL: 'http://localhost:8545'

// Node 2
RPC_URL: 'http://localhost:8547'

// Node 3
RPC_URL: 'http://localhost:8549'
```

## 📈 Monitoring

### View Deployment Information

```bash
cat deployment.json
```

### View Test Results

```bash
cat test-results.json
```

### Check Contract on Etherscan-like Tools

Since this is a private network, you can use:
- **Remix IDE**: Connect to your private network
- **MetaMask**: Add your network and import accounts
- **Custom Tools**: Use the provided interaction scripts

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot connect to Ethereum node"**
   - Ensure your private network is running: `./manage-network.sh status`
   - Check if Node 1 is accessible: `curl http://localhost:8545`

2. **"No accounts found"**
   - Ensure accounts are unlocked in your Geth nodes
   - Check account funding in genesis block

3. **"Insufficient gas"**
   - Increase gas limit in CONFIG
   - Check gas price settings

4. **"Contract deployment failed"**
   - Ensure deployer account has enough ETH
   - Check network connectivity
   - Verify contract compilation

### Debug Mode

Enable detailed logging by modifying the scripts:

```javascript
// Add to any script
this.web3.eth.currentProvider.debug = true;
```

## 📚 Examples

### Using Web3.js

```javascript
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

// Load deployed contract
const contractData = require('./build/MyToken.json');
const contract = new web3.eth.Contract(contractData.abi, 'CONTRACT_ADDRESS');

// Get token info
const name = await contract.methods.name().call();
console.log('Token name:', name);

// Transfer tokens
await contract.methods.transfer('RECIPIENT_ADDRESS', web3.utils.toWei('100', 'ether'))
    .send({ from: 'YOUR_ADDRESS', gas: 100000 });
```

### Using MetaMask

1. Add your private network to MetaMask
2. Import accounts using private keys
3. Connect to the deployed contract
4. Interact through the MetaMask interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the main project README.md
3. Check network status: `./manage-network.sh status`
4. View logs: `./manage-network.sh logs`

---

**Happy Smart Contract Development! 🎉**
