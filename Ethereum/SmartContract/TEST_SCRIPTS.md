# Smart Contract Test Scripts

This directory contains JavaScript test scripts to interact with your deployed MyERC20Token smart contract.

## 📦 Contract Information

- **Contract Address**: `0x78C9506af12dEc8bf37a91b2dadE16D07Ff39Dd2`
- **Network**: Kurtosis Ethereum (Chain ID: 585858)
- **RPC URL**: `http://127.0.0.1:32800`
- **Block Explorer (Dora)**: `http://127.0.0.1:32826`

## 🚀 Available Test Scripts

### 1. Simple Test (Recommended for beginners)
```bash
npm run simple-test
```
- Basic contract interaction
- Shows token information
- Tests transfer functionality
- Uses Hardhat framework

### 2. Full Interaction Test
```bash
npm run interact
```
- Comprehensive contract testing
- Tests ERC20 functions (transfer, approve, allowance)
- Tests ERC20Permit functionality
- Shows recent events
- Uses Hardhat framework

### 3. Web3.js Test (Direct RPC)
```bash
npm run web3-test
```
- Direct RPC connection
- No Hardhat dependency
- Uses web3.js library
- Shows contract creation details

## 📋 Prerequisites

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Ensure Network is Running**:
   - Kurtosis network should be running
   - Contract should be deployed

## 🔧 Script Details

### `scripts/simple-test.js`
- **Purpose**: Basic contract interaction
- **Features**:
  - Read token information (name, symbol, decimals, total supply)
  - Check account balance
  - Test transfer functionality
  - Show current block number

### `scripts/interact.js`
- **Purpose**: Comprehensive contract testing
- **Features**:
  - All ERC20 standard functions
  - ERC20Permit signature testing
  - Event querying
  - Network information
  - Error handling

### `scripts/web3-test.js`
- **Purpose**: Direct RPC interaction
- **Features**:
  - Direct web3.js connection
  - Contract ABI interaction
  - Transaction details
  - No Hardhat dependency

## 🎯 Expected Output

All scripts should show:
- ✅ Contract name: "MyERC20Token"
- ✅ Symbol: "MTK"
- ✅ Decimals: 18
- ✅ Total Supply: 1000 MTK
- ✅ Deployer Balance: 1000 MTK
- ✅ Current block number
- ✅ Transaction details

## 🐛 Troubleshooting

### If scripts fail:

1. **Check Network Connection**:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        http://127.0.0.1:32800
   ```

2. **Verify Contract Address**:
   - Make sure the contract address is correct
   - Check if the contract is deployed

3. **Check Account Balance**:
   - Ensure the account has ETH for gas fees
   - Check if the account is the deployer

## 📊 Contract Functions Tested

- `name()` - Returns token name
- `symbol()` - Returns token symbol  
- `decimals()` - Returns token decimals
- `totalSupply()` - Returns total supply
- `balanceOf(address)` - Returns balance of address
- `transfer(address, uint256)` - Transfers tokens
- `approve(address, uint256)` - Approves spending
- `allowance(address, address)` - Checks allowance
- `nonces(address)` - Returns nonce for permit

## 🎉 Success Indicators

- All functions return expected values
- No error messages
- Transaction hashes are generated
- Block numbers are shown
- Balances are correctly displayed

## 📝 Notes

- The contract is deployed on the Kurtosis network
- All scripts use the deployed contract address
- Scripts are designed to be safe and non-destructive
- Some transfer tests may fail (expected behavior for test addresses)
