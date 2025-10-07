# Test Directory

This directory contains comprehensive testing scripts for validating your Ethereum Web Wallet setup, including account functionality and deployed contract interactions.

## 📁 Test Files

### Core Tests

- **`test-account.js`** - Tests account balance and network connectivity
- **`test-contract.js`** - Tests interaction with deployed smart contracts  
- **`test-deployment.js`** - Tests contract deployment readiness
- **`test-network.js`** - Tests RPC network connectivity and health
- **`test-all.js`** - Comprehensive test suite running all tests

## 🚀 Quick Start

### Run All Tests
```bash
npm run test
```

### Run Individual Tests
```bash
# Test account balance and network
npm run test:account

# Test deployed contract interaction
npm run test:contract

# Test contract deployment readiness
npm run test:deployment

# Test network connectivity
npm run test:network
```

## 📋 Test Descriptions

### 1. Account Test (`test-account.js`)
**What it tests:**
- ✅ Network connection using RPC_URL
- ✅ Account balance checking
- ✅ Network information verification
- ✅ Gas price information
- ✅ Balance sufficiency warnings

**Requirements:**
- `ACCOUNT_ADDRESS` in .env
- `RPC_URL` in .env

### 2. Contract Test (`test-contract.js`)
**What it tests:**
- ✅ Contract existence at specified address
- ✅ Contract ABI loading from compiled files
- ✅ Basic contract function calls (name, symbol, etc.)
- ✅ Token balance checking
- ✅ Gas estimation for transactions
- ✅ Owner verification (if applicable)

**Requirements:**
- `CONTRACT_ADDRESS` in .env (must be a deployed contract)
- `PRIVATE_KEY` in .env
- Compiled contract files in `compiled/` directory

### 3. Deployment Test (`test-deployment.js`)
**What it tests:**
- ✅ Contract compilation files availability
- ✅ Deployer account balance sufficiency
- ✅ Gas estimation for deployment
- ✅ Constructor argument validation
- ✅ Deployment cost calculation

**Requirements:**
- `PRIVATE_KEY` in .env
- Compiled contract files in `compiled/` directory
- Sufficient ETH balance for gas fees

### 4. Network Test (`test-network.js`)
**What it tests:**
- ✅ RPC endpoint connectivity
- ✅ Network information and chain ID
- ✅ Gas price and fee data
- ✅ Block information retrieval
- ✅ Response time measurement
- ✅ Connection stability

**Requirements:**
- `RPC_URL` in .env

## 🔧 Setup Requirements

### Environment Variables
Ensure your `.env` file contains:
```env
# Required for all tests
RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Required for account/contract tests
ACCOUNT_ADDRESS=0x...
PRIVATE_KEY=0x...

# Required for contract tests (if testing deployed contract)
CONTRACT_ADDRESS=0x...

# Optional but recommended
DEFAULT_NETWORK=sepolia
MYTOKEN_INITIAL_OWNER=0x...
SIMPLETOKEN_NAME=MyToken
SIMPLETOKEN_SYMBOL=MTK
SIMPLETOKEN_INITIAL_SUPPLY=1000000
```

### Compiled Contracts
For deployment and contract tests, ensure contracts are compiled:
```bash
npm run compile:erc20    # Compiles MyToken
npm run compile:simple   # Compiles SimpleToken
```

## 📊 Test Output Examples

### Successful Test Run
```
🧪 Account Balance Test
======================
✅ Connected to network: sepolia
✅ ETH Balance: 0.049 ETH
✅ Sufficient balance for transactions
🎉 Account balance test completed successfully!
```

### Failed Test Run
```
❌ Contract test failed: No contract found at this address
💡 Make sure the contract is deployed and the address is correct
```

## 🛠️ Troubleshooting

### Common Issues

1. **"RPC_URL not found"**
   - Add `RPC_URL` to your `.env` file
   - Example: `RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY`

2. **"No contract found at this address"**
   - Deploy a contract first: `npm run deploy`
   - Update `CONTRACT_ADDRESS` in `.env` with deployed address

3. **"Could not load contract ABI"**
   - Compile contracts: `npm run compile:erc20`
   - Check `compiled/` directory exists

4. **"Insufficient balance"**
   - Get testnet ETH from faucets:
     - https://faucets.chain.link/sepolia
     - https://sepoliafaucet.com

5. **Network connectivity issues**
   - Check internet connection
   - Verify RPC URL is correct
   - Try different RPC endpoint

## 💡 Best Practices

1. **Run tests regularly** after making changes
2. **Test on testnet first** before mainnet
3. **Keep test results** for debugging
4. **Update .env** with correct addresses after deployment
5. **Monitor gas prices** for cost optimization

## 🎯 Integration with Development Workflow

```bash
# 1. Set up environment
cp .env.example .env  # Configure your settings

# 2. Compile contracts
npm run compile:erc20

# 3. Test setup
npm run test:account
npm run test:network

# 4. Deploy contract
npm run deploy

# 5. Update CONTRACT_ADDRESS in .env

# 6. Test deployed contract
npm run test:contract

# 7. Run full test suite
npm run test
```

This testing framework ensures your Web Wallet setup is working correctly and helps identify issues early in the development process.