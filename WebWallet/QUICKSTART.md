# Quick Start Guide

## Problem: Cannot Compile MyERC20Token in Web Page

**Why?** Browser-based compilers cannot resolve OpenZeppelin imports like:
```solidity
import {ERC1363} from "@openzeppelin/contracts/token/ERC20/extensions/ERC1363.sol";
```

## ✅ Solution: Upload Pre-Compiled Contract

### Step-by-Step for MyERC20Token

#### 1. Compile Locally (Terminal)

```bash
npm run compile:erc20
```

**Output:** `compiled/MyToken.json` (79KB file with ABI and bytecode)

#### 2. Open Web Interface

Visit: http://localhost:8080

#### 3. Deploy Using Web Interface

1. Click tab: **"Smart Contract Deployment"**

2. Under **"Option 1: Upload Pre-compiled Contract"**:
   - Click "Choose File"
   - Select: `compiled/MyToken.json`
   - Click: **"📁 Load Compiled Contract"**

3. You should see: ✅ MyToken loaded successfully!

4. Configure deployment:
   - **Network**: Choose `Local (Hardhat/Ganache)`
   - **Private Key**: Paste from your `.env` file
   - **Constructor Arguments**: Your wallet address
     - Example: `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb`

5. Click: **"🚀 Deploy Contract"**

#### 4. View Results

After deployment completes:
- **Contract Address**: Copy this! (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`)
- **Transaction Hash**: Link to view on explorer

---

## Testing Locally

### Start Local Blockchain

```bash
# Terminal 1: Start Hardhat node
npx hardhat node
```

This gives you 20 test accounts with 10,000 ETH each:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Use Test Account

Update `.env`:
```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
WALLET_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### Deploy

Now follow the deployment steps above!

---

## Alternative: Command-Line Deployment

If you prefer the command line:

```bash
# Make sure .env has your private key
npm run deploy:local
```

---

## Summary

**For contracts WITH imports (MyERC20Token):**
1. `npm run compile:erc20` → Creates `compiled/MyToken.json`
2. Upload JSON to web interface → Deploy

**For contracts WITHOUT imports (SimpleToken):**
- Can compile directly in browser (Option 2)
- OR use same upload method as above

**Cannot do:**
- ❌ Compile OpenZeppelin imports in browser
- ❌ Browser cannot access node_modules

**Can do:**
- ✅ Compile locally with Node.js
- ✅ Upload compiled JSON to web interface
- ✅ Deploy from web interface

---

## Files Location

```
WebWallet/
├── compiled/
│   ├── MyToken.json         ← Upload this for MyERC20Token
│   └── SimpleToken.json     ← Upload this for SimpleToken
├── SmartContract/contacts/
│   ├── MyERC20Token.sol     ← Your OpenZeppelin token
│   └── SimpleToken.sol      ← Simple contract (no imports)
├── .env                     ← Your private key
└── index.html               ← Web interface
```

---

## Troubleshooting

### "Invalid compiled contract format"
- Make sure you're uploading the `.json` file from `compiled/` folder
- Not the `.sol` source file

### "Please compile the contract first!"
- Click the **"📁 Load Compiled Contract"** button after selecting file
- Wait for "✅ loaded successfully" message

### "insufficient funds for gas"
- Make sure your wallet has ETH
- For local testing, use Hardhat node test accounts

### Browser compilation errors
- Don't use browser compiler for OpenZeppelin contracts
- Use Option 1 (upload pre-compiled JSON) instead
