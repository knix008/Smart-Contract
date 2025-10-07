# Smart Contract Deployment Guide

## Two Ways to Compile & Deploy

### Method 1: Local Compilation (Recommended for OpenZeppelin contracts)

Use this method for contracts with external imports like OpenZeppelin.

#### Step 1: Compile with Node.js

```bash
# Compile your MyERC20Token contract
npm run compile:erc20

# This creates: compiled/MyToken.json
```

#### Step 2: Get Contract Info

```bash
# View the compiled contract
cat compiled/MyToken.json | jq '.contractName, .bytecode' | head -20
```

The compiled JSON contains:
- `abi`: Contract ABI (Application Binary Interface)
- `bytecode`: Compiled bytecode for deployment

#### Step 3: Deploy Using ethers.js Script

Create a deployment script:

```javascript
// deploy-mytoken.js
import { ethers } from 'ethers';
import { readFileSync } from 'fs';

const compiled = JSON.parse(readFileSync('./compiled/MyToken.json', 'utf8'));

async function deploy() {
    // Connect to network
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');

    // Load wallet from .env
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);

    // Create contract factory
    const factory = new ethers.ContractFactory(
        compiled.abi,
        compiled.bytecode,
        wallet
    );

    // Deploy (MyToken constructor requires initialOwner address)
    console.log('Deploying MyToken...');
    const contract = await factory.deploy(wallet.address);
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log('MyToken deployed to:', address);

    return address;
}

deploy().catch(console.error);
```

Run deployment:

```bash
node deploy-mytoken.js
```

---

### Method 2: Browser Compilation (For simple contracts only)

Use this method **only** for contracts without external imports.

#### Example: SimpleToken.sol

1. Open http://localhost:8080
2. Go to **"Smart Contract Deployment"** tab
3. Click "Choose File" and select `SmartContract/contacts/SimpleToken.sol`
4. Click **"🔨 Compile Contract"**
5. Select network (Local/Sepolia/Mainnet)
6. Enter private key
7. Constructor arguments: `"MyToken", "MTK", 1000000`
8. Click **"🚀 Deploy Contract"**

---

## Deploying MyERC20Token (Your Selected Contract)

Since `MyERC20Token.sol` uses OpenZeppelin imports, follow **Method 1**.

### Quick Deploy Script

```bash
# 1. Compile
npm run compile:erc20

# 2. Create deployment script
cat > deploy.js << 'EOF'
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const compiled = JSON.parse(readFileSync('./compiled/MyToken.json', 'utf8'));

async function main() {
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const factory = new ethers.ContractFactory(compiled.abi, compiled.bytecode, wallet);

    console.log('Deploying MyToken with account:', wallet.address);
    const contract = await factory.deploy(wallet.address); // initialOwner

    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log('MyToken deployed to:', address);
    console.log('Transaction hash:', contract.deploymentTransaction().hash);
}

main().catch(console.error);
EOF

# 3. Install dotenv if needed
npm install dotenv

# 4. Deploy
node deploy.js
```

### Network Configuration

Edit deploy.js to change networks:

```javascript
// Local (Hardhat/Ganache)
const provider = new ethers.JsonRpcProvider('http://localhost:8545');

// Sepolia Testnet
const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');

// Ethereum Mainnet (⚠️ Use with caution!)
const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
```

---

## Constructor Arguments

### MyToken (MyERC20Token.sol)

```solidity
constructor(address initialOwner)
```

**Arguments:**
- `initialOwner`: Address that will own the contract (usually your wallet address)

**Example:**
```javascript
await factory.deploy('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
```

### SimpleToken.sol

```solidity
constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
```

**Arguments:**
- `_name`: Token name (e.g., "MyToken")
- `_symbol`: Token symbol (e.g., "MTK")
- `_initialSupply`: Initial supply (e.g., 1000000)

**Example:**
```javascript
await factory.deploy('MyToken', 'MTK', 1000000);
```

---

## Troubleshooting

### Browser Compilation Fails

**Error:** "File import callback not supported"

**Solution:** This means your contract has external imports. Use Method 1 (Local Compilation) instead.

### Deployment Fails

**Error:** "insufficient funds"

**Solution:** Make sure your wallet has enough ETH for gas fees.

**Error:** "nonce too low"

**Solution:** Your account nonce is out of sync. Wait a moment and try again.

### Contract Address Not Showing

**Solution:** Check browser console (F12) for errors. The deployment might have failed but the error wasn't caught.

---

## Testing Locally

### Start Local Ethereum Node

```bash
# Install Hardhat if not already installed
npm install --save-dev hardhat

# Start local node
npx hardhat node
```

This starts a local Ethereum node at `http://localhost:8545` with pre-funded test accounts.

### Use Test Account

Hardhat provides 20 test accounts with 10000 ETH each. Use any of these for testing:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Update your `.env` file with a test private key:

```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

---

## Security Checklist

- [ ] Never commit `.env` files to git
- [ ] Use separate wallets for testnet and mainnet
- [ ] Test on Sepolia before deploying to mainnet
- [ ] Verify your private key is correct
- [ ] Double-check constructor arguments
- [ ] Ensure sufficient gas funds in wallet
- [ ] Save deployed contract address

---

## Summary

**For MyERC20Token.sol:**
1. `npm run compile:erc20` → compiles with OpenZeppelin imports
2. Create deployment script using `compiled/MyToken.json`
3. Deploy with: `node deploy.js`

**For SimpleToken.sol:**
- Can use either method (browser or local)
- Browser is easier for simple contracts

**Browser compilation limitation:**
- Cannot resolve external imports (OpenZeppelin, etc.)
- Only works for single-file contracts
