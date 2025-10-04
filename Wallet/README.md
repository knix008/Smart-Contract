# Ethereum Wallet & ERC20 Token Project

A complete Ethereum wallet application and ERC20 token smart contract built with Node.js, ethers.js, and Hardhat.

## Project Structure

```
Wallet/
├── wallet.js              # Ethereum wallet class
├── wallet-cli.js          # Interactive CLI wallet manager
├── wallet.sh              # Shell script launcher
├── example.js             # Wallet usage examples
├── SmartContract/
│   ├── contracts/
│   │   └── MyToken.sol   # ERC20 token contract
│   ├── scripts/
│   │   └── deploy.js     # Deployment script
│   ├── hardhat.config.js # Hardhat configuration
│   └── .env.example      # Environment variables template
```

## Features

### Wallet Application
- Create new wallets with private keys and mnemonic phrases
- Import wallets from private key or mnemonic
- Check ETH balances
- Send transactions
- Sign and verify messages
- Get gas prices and transaction counts

### ERC20 Token (MyToken)
- Standard ERC20 functionality (transfer, approve, allowance)
- Minting capability (owner only)
- Burning capability
- Supply cap (1 billion tokens max)
- Owner-controlled access

## Installation

### Wallet Application

```bash
npm install
```

### Smart Contract

```bash
cd SmartContract
npm install
```

## Usage

### Wallet Application

#### Interactive CLI Wallet Manager

Run the interactive wallet CLI:

```bash
./wallet.sh
```

Or directly with Node.js:

```bash
node wallet-cli.js
```

Features:
- Create new wallets
- Import from private key or mnemonic
- Save/load wallets from file
- Connect to different networks (Mainnet, Sepolia, custom RPC)
- Check balances
- Send transactions
- Sign and verify messages
- Get gas prices
- View wallet information

#### Run Example Script

```bash
node example.js
```

#### Use the wallet class in your code:

```javascript
const EthereumWallet = require('./wallet');

const wallet = new EthereumWallet();

// Create new wallet
const newWallet = wallet.createWallet();
console.log('Address:', newWallet.address);
console.log('Private Key:', newWallet.privateKey);
console.log('Mnemonic:', newWallet.mnemonic);

// Connect to network
wallet.connectToNetwork('https://eth.llamarpc.com');

// Check balance
const balance = await wallet.getBalance();
console.log('Balance:', balance, 'ETH');

// Send transaction
await wallet.sendTransaction('0xRecipientAddress', '0.001');

// Sign message
const signature = await wallet.signMessage('Hello, Ethereum!');
```

### Smart Contract

#### Compile Contract

```bash
cd SmartContract
npx hardhat compile
```

#### Deploy Locally

Terminal 1 - Start local node:
```bash
npx hardhat node
```

Terminal 2 - Deploy contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

#### Deploy to Sepolia Testnet

1. Copy environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
ETHERSCAN_API_KEY=your_etherscan_api_key_here
INITIAL_SUPPLY=1000000
```

3. Deploy to Sepolia:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

#### Verify Contract on Etherscan

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <INITIAL_SUPPLY>
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234567890abcdef1234567890abcdef12345678 1000000
```

## Smart Contract Functions

### Owner Functions
- `mint(address to, uint256 amount)` - Mint new tokens (owner only)

### Public Functions
- `transfer(address to, uint256 amount)` - Transfer tokens
- `approve(address spender, uint256 amount)` - Approve spending
- `transferFrom(address from, address to, uint256 amount)` - Transfer from approved address
- `burn(uint256 amount)` - Burn your tokens
- `balanceOf(address account)` - Check balance
- `allowance(address owner, address spender)` - Check allowance

## Configuration

### Wallet Configuration

Edit the RPC URL in your code:
```javascript
wallet.connectToNetwork('YOUR_RPC_URL');
```

### Smart Contract Networks

Networks are configured in `SmartContract/hardhat.config.js`:
- **hardhat**: Local development network
- **localhost**: Local node (port 8545)
- **sepolia**: Sepolia testnet
- **mainnet**: Ethereum mainnet

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit your `.env` file** - It contains sensitive private keys
2. **Never share your private keys** - Store them securely
3. **Use testnet first** - Test thoroughly before mainnet deployment
4. **Keep backups** - Store mnemonic phrases securely offline
5. **Verify transactions** - Always double-check addresses and amounts

## Dependencies

### Wallet Application
- `ethers` - Ethereum library for wallet operations

### Smart Contract
- `hardhat` - Development environment
- `@nomicfoundation/hardhat-toolbox` - Hardhat plugins bundle
- `@openzeppelin/contracts` - Secure smart contract library
- `dotenv` - Environment variable management

## Testing

Run tests (after creating test files):
```bash
cd SmartContract
npx hardhat test
```

## Getting Testnet ETH

To deploy on Sepolia testnet, you'll need test ETH:
- [Sepolia Faucet 1](https://sepoliafaucet.com/)
- [Sepolia Faucet 2](https://www.alchemy.com/faucets/ethereum-sepolia)
- [Sepolia Faucet 3](https://faucet.quicknode.com/ethereum/sepolia)

## RPC Providers

Get free RPC endpoints from:
- [Infura](https://infura.io)
- [Alchemy](https://alchemy.com)
- [QuickNode](https://quicknode.com)

## License

ISC

## Resources

- [Ethers.js Documentation](https://docs.ethers.org/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethereum Development Documentation](https://ethereum.org/en/developers/docs/)
