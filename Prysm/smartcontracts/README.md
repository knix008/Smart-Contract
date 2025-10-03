# ERC20 Token Smart Contract

An ERC20 token implementation using OpenZeppelin contracts (latest version 5.1.0).

## Features

- **ERC20 Standard**: Full ERC20 implementation
- **Minting**: Owner can mint new tokens
- **Burning**: Token holders can burn their tokens
- **Pausable**: Owner can pause/unpause all transfers
- **Permit (EIP-2612)**: Gasless approvals using signatures
- **Ownable**: Access control for administrative functions

## Token Details

- **Name**: MyToken
- **Symbol**: MTK
- **Decimals**: 18
- **Initial Supply**: 1,000,000 MTK (minted to owner)

## Installation

```bash
cd smartcontracts
npm install
```

## Compilation

```bash
npm run compile
```

## Testing

```bash
npm test
```

## Deployment

### To Private Network

Make sure your private Ethereum network is running, then:

```bash
npm run deploy
```

### To Specific Network

```bash
npx hardhat run scripts/deploy.js --network localhost
```

## Configuration

The contract is configured to deploy to your private network:
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 32382

**Note**: Update the private key in `hardhat.config.js` with your actual account's private key.

## Contract Functions

### Public Functions

- `transfer(address to, uint256 amount)` - Transfer tokens
- `approve(address spender, uint256 amount)` - Approve spending
- `transferFrom(address from, address to, uint256 amount)` - Transfer from approved address
- `burn(uint256 amount)` - Burn your tokens
- `permit(...)` - Gasless approval via signature

### Owner Functions

- `mint(address to, uint256 amount)` - Mint new tokens
- `pause()` - Pause all transfers
- `unpause()` - Resume all transfers

## File Structure

```
smartcontracts/
├── contracts/
│   └── MyToken.sol         # Main ERC20 contract
├── scripts/
│   └── deploy.js           # Deployment script
├── test/
│   └── MyToken.test.js     # Contract tests
├── package.json            # Dependencies
├── hardhat.config.js       # Hardhat configuration
└── README.md               # This file
```

## Usage Example

```javascript
const { ethers } = require("hardhat");

async function main() {
  const token = await ethers.getContractAt("MyToken", "CONTRACT_ADDRESS");

  // Transfer tokens
  await token.transfer("0x...", ethers.parseEther("100"));

  // Check balance
  const balance = await token.balanceOf("0x...");
  console.log("Balance:", ethers.formatEther(balance));

  // Mint (owner only)
  await token.mint("0x...", ethers.parseEther("1000"));
}
```

## Security

- Access control via OpenZeppelin's `Ownable`
- Pausable functionality for emergency stops
- Using audited OpenZeppelin contracts
- **WARNING**: Never commit private keys to version control

## Dependencies

- OpenZeppelin Contracts v5.1.0
- Hardhat
- Hardhat Toolbox (includes ethers.js, chai, etc.)
