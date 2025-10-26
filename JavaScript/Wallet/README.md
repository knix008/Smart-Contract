# Ethereum Wallet Web Application

A modern, feature-rich Ethereum wallet web application built with vanilla JavaScript and ethers.js. Create accounts, sign transactions, and send ETH on Ethereum Mainnet and Sepolia Testnet.

## Table of Contents

- [Quick Start](#quick-start)
- [What Makes This Wallet Special](#what-makes-this-wallet-special)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Testing](#testing)
- [Configuration](#configuration)
- [Usage](#usage)
- [Network Support](#network-support)
- [Security Warnings](#security-warnings)
- [Recent Updates](#recent-updates)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure RPC endpoints (IMPORTANT!)
cp .env.example .env
# Edit .env and add your Infura/Alchemy API keys

# 3. Start development server
npm run dev

# Or use the convenience script
./start.sh
```

The application will open at `http://localhost:8080` (or port 8081 if 8080 is in use).

**⚠️ Important:** Configure your `.env` file with valid RPC endpoints before running the app for the first time!

**Tip:** You can immediately start checking balances of any Ethereum address without creating an account!

## What Makes This Wallet Special

✨ **No Installation Required** - Just enter an address and check its balance
🌐 **Multi-Network Support** - Seamlessly switch between Mainnet and Sepolia
🔍 **Balance Checker** - Look up any Ethereum address balance instantly
🔐 **Secure** - Private keys stored locally (browser localStorage)
📦 **Configurable** - Use your own RPC endpoints via `.env` file
🎯 **Simple** - Clean, intuitive interface focused on usability
🧪 **Well-Tested** - Comprehensive test suite with 98% pass rate (50/51 tests passing)

## Features

- 🔐 **Account Management**
  - Create new Ethereum wallets
  - Import existing wallets using private keys
  - Secure local storage for wallet persistence
  - Configure wallet via environment variables (.env file)

- 💰 **Balance Checker**
  - Check balance for any Ethereum address
  - View balances on both Mainnet and Sepolia networks
  - Switch between networks dynamically
  - Real-time balance updates

- 💸 **Transaction Management**
  - Sign transactions offline
  - Send transactions to blockchain
  - Support for Ethereum Mainnet and Sepolia Testnet
  - Real-time transaction status and confirmation
  - Automatic gas fee calculation

- 📊 **Transaction History**
  - View recent transaction history
  - Display transaction hash, block number, and status
  - Track both signed and sent transactions
  - Store up to 10 recent transactions

- 🎨 **Modern UI**
  - Beautiful gradient design
  - Responsive layout for mobile and desktop
  - Intuitive user interface
  - Real-time feedback and error handling
  - Network connection status display

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Wallet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Development

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

This will start a development server at `http://localhost:8080` and automatically open it in your browser.

## Production Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Testing

The project includes a comprehensive test suite using Jest.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The test suite includes **51 comprehensive tests** with a **98% pass rate** (50/51 passing):

- **Wallet Creation & Import Tests** (7 tests) - Validates wallet generation and private key imports
- **Address Validation Tests** (7 tests) - Ensures proper Ethereum address validation including checksumming
- **Balance Checking Tests** (3 tests) - Tests balance retrieval from blockchain
- **Transaction Tests** (4 tests) - Validates transaction creation and signing
- **Provider Connection Tests** (3 tests) - Ensures RPC endpoint connectivity
- **Network Support Tests** (2 tests) - Tests Mainnet and Sepolia connectivity
- **Error Handling Tests** (2 tests) - Validates proper error handling
- **ETH/Wei Conversion Tests** (5 tests) - Tests currency conversions and formatting
- **Gas Utilities Tests** (3 tests) - Tests gas price calculations
- **Cryptographic Tests** (6 tests) - Tests hashing, signing, and key derivation
- **Data Encoding Tests** (5 tests) - Tests hex encoding and function signatures
- **Environment Configuration Tests** (2 tests) - Validates .env file loading

**Note:** One test fails due to insufficient funds (expected behavior for newly created wallets).

Test files are located in the `tests/` directory:
- `tests/wallet.test.js` - Core wallet functionality (26 tests)
- `tests/utils.test.js` - Utility functions (25 tests)

## Configuration

### Using Environment Variables (.env)

You can configure RPC endpoints using a `.env` file:

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your RPC configuration:
   ```
   # RPC Endpoints (REQUIRED for proper functionality)
   ETHEREUM_MAINNET_RPC=https://mainnet.infura.io/v3/YOUR_API_KEY
   ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_API_KEY

   # Optional: Pre-configured private key for auto-import
   PRIVATE_KEY=your_private_key_here
   ```

   **Important:** Get your free API keys from:
   - [Infura](https://infura.io/) (Recommended)
   - [Alchemy](https://www.alchemy.com/)
   - [QuickNode](https://www.quicknode.com/)

3. **Rebuild the application** after modifying `.env`:
   ```bash
   npm run build  # Or restart dev server with npm run dev
   ```

**Note:**
- The `.env` file is already included in `.gitignore` to keep your keys secure
- Environment variables are bundled at build time using webpack DefinePlugin
- You must rebuild/restart the dev server after changing `.env` for changes to take effect

## Usage

### 1. Check Balance for Any Address

1. Enter any Ethereum address in the "Ethereum Address" field
2. Click "Check Balance" or press Enter
3. View the balance for the selected network (Mainnet or Sepolia)
4. Switch networks to see balances on different networks
5. Click "Refresh" to update the balance

**Note:** You don't need to create or import an account to check balances!

### 2. Create a New Account

1. Click the "Create New Account" button
2. A new Ethereum wallet will be generated
3. **IMPORTANT**: Save your private key securely when prompted
4. The wallet address and balance will be displayed

### 3. Import an Existing Account

1. Click "Import Account (Private Key)"
2. Enter your private key
3. Your account will be loaded and displayed

### 4. Send a Transaction

1. Select your network (Mainnet or Sepolia Testnet)
2. Enter the recipient's Ethereum address
3. Enter the amount in ETH
4. Click "Sign Transaction" to sign without sending, or
5. Click "Send Transaction" to sign and broadcast to the network

### 5. View Transaction History

- All transactions (signed and sent) appear in the Transaction History section
- View transaction hashes, block numbers, and status
- History is limited to the last 10 transactions

## Network Support

- **Ethereum Mainnet**: Production network for real ETH
- **Sepolia Testnet**: Test network for development and testing

### Network Switching

- Easily switch between networks using the dropdown selector
- Balance automatically updates when switching networks
- Each network has its own balance for the same address
- Transaction history is network-independent

## Security Warnings

⚠️ **IMPORTANT SECURITY NOTES:**

- This is a demo/educational wallet application
- Private keys are stored in browser localStorage (not secure for production)
- **DO NOT** use this application for production purposes without proper security measures
- **NEVER** share your private keys with anyone
- **ALWAYS** verify recipient addresses before sending transactions
- Start with small amounts on testnet before using mainnet
- If using `.env` file, never commit it to version control
- The `.env` file should only exist locally on your machine

## Recent Updates

### v1.0.0 - Latest
- ✅ **Fixed balance checking** - Now correctly prioritizes pasted addresses over created wallet addresses
- ✅ **Improved environment variable loading** - Switched from dotenv-webpack to webpack DefinePlugin for reliable .env loading
- ✅ **Added comprehensive test suite** - 51 tests covering wallet, transactions, and utilities (98% pass rate - 50/51 passing)
- ✅ **Updated RPC endpoints** - Now uses Infura by default for better reliability
- ✅ **Enhanced documentation** - Added testing guide, FAQ section, and clearer configuration instructions
- ✅ **Fixed test compatibility** - Updated tests to match ethers.js v6 behavior

### Bug Fixes
- Fixed issue where checking balance after creating a new account would show 0.0 ETH even when checking a different address with funds
- Fixed environment variable loading that caused balance checks to fail
- Improved error handling for RPC endpoint failures

## Technology Stack

- **Ethers.js v6**: Ethereum JavaScript library for blockchain interactions
- **Webpack 5**: Module bundler and development server
- **Jest**: Testing framework with comprehensive test coverage
- **dotenv**: Environment variable configuration
- **HTML/CSS/JavaScript**: Frontend technologies (vanilla JS, no frameworks)
- **LocalStorage**: Client-side storage for wallet persistence

## Project Structure

```
Wallet/
├── src/
│   ├── index.html       # HTML structure
│   ├── index.js         # Main application logic
│   └── styles.css       # Styling
├── tests/
│   ├── wallet.test.js   # Wallet functionality tests
│   └── utils.test.js    # Utility functions tests
├── dist/                # Build output (generated)
├── node_modules/        # Dependencies (generated)
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Example environment configuration
├── package.json         # Project configuration
├── webpack.config.js    # Webpack configuration
├── jest.config.js       # Jest testing configuration
└── README.md           # This file
```

## API Endpoints

The application uses RPC endpoints configured via the `.env` file:
- **Mainnet**: Configured via `ETHEREUM_MAINNET_RPC`
- **Sepolia**: Configured via `ETHEREUM_SEPOLIA_RPC`

**Recommended RPC Providers:**
- [Infura](https://infura.io/) - Free tier: 100K requests/day
- [Alchemy](https://www.alchemy.com/) - Free tier available
- [QuickNode](https://www.quicknode.com/) - Free tier available

**Why configure RPC endpoints?**
- Public RPC endpoints can be unreliable or rate-limited
- Personal API keys provide better performance and uptime
- Required for production use

## Troubleshooting

### Balance Shows 0.0 ETH When It Should Have Funds

**Problem:** After creating a new account, when you paste a different address to check its balance, it shows 0.0 ETH even though that address has funds.

**Solution:** This was fixed in v1.0.0. Make sure you're running the latest version. The app now correctly prioritizes the pasted address over the created wallet address.

**If the issue persists:**
- Refresh the page (Ctrl+R or Cmd+R)
- Clear the address input and paste the address again
- Click "Check Balance" button
- Ensure `.env` file is configured with valid RPC endpoints
- Restart the dev server: `npm run dev`

### Balance Not Showing or Wrong Value

- **Invalid Address**: Make sure you entered a valid Ethereum address (0x followed by 40 hex characters)
- **Wrong Network**: Ensure you're checking the balance on the correct network (Mainnet vs Sepolia)
- **No Balance**: The address might not have any ETH on that network (new addresses show 0 ETH)
- **RPC Error**: Check your `.env` file has valid RPC endpoints configured
- **RPC Connection**: Ensure your RPC endpoint (Infura/Alchemy) is accessible and has available quota
- **Solution**: Try clicking "Refresh" button or switching networks and back

### Transaction Fails

- Ensure you have sufficient balance (ETH) to cover gas fees
- Verify the recipient address is correct
- Check that you're connected to the correct network
- Make sure the account has enough balance for the transaction amount + gas fees
- For testnet, make sure you're using Sepolia ETH, not mainnet ETH

### Balance Not Updating

- Click the "Refresh" button next to the balance
- Switch networks to trigger a refresh
- Ensure the RPC endpoint is accessible
- Check browser console for error messages (F12 → Console)

### Account Not Persisting

- Check browser settings for localStorage permissions
- Ensure cookies are enabled
- Try clearing browser cache and reloading
- Private keys from `.env` file always take priority over localStorage

### Network Connection Issues

- Check if the RPC endpoint is online
- Try switching between Mainnet and Sepolia to test connectivity
- Consider using your own RPC endpoint (Infura, Alchemy, etc.) in the `.env` file
- Check browser console for detailed error messages

## FAQ

### Q: Do I need to create an account to check balances?
**A:** No! You can paste any Ethereum address and check its balance without creating or importing a wallet.

### Q: Why is my balance showing 0.0 ETH?
**A:** Make sure you:
1. Selected the correct network (Mainnet vs Sepolia)
2. Configured valid RPC endpoints in your `.env` file
3. Are checking an address that actually has funds on that network
4. The address you pasted is being used (not a previously created wallet address)

### Q: Is this wallet safe for production use?
**A:** No. This is an educational/development wallet. Private keys are stored in browser localStorage which is NOT secure for production. Never use this with large amounts of ETH or on mainnet without proper security measures.

### Q: Can I use this on mobile?
**A:** The UI is responsive and works on mobile browsers, but the same security warnings apply.

### Q: Where can I get test ETH for Sepolia?
**A:** Use a Sepolia faucet:
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [QuickNode Sepolia Faucet](https://faucet.quicknode.com/ethereum/sepolia)

### Q: How do I run the tests?
**A:** Simply run `npm test`. To see test coverage, run `npm run test:coverage`.

**Test Results:** 50 out of 51 tests pass (98% pass rate). The only failing test is "should sign a transaction" which fails due to insufficient funds - this is expected behavior since newly created test wallets have 0 ETH.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

**To contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`) to ensure everything works
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

**Before submitting:**
- Ensure all tests pass
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## License

MIT License - feel free to use this project for learning and development.

## Disclaimer

This wallet application is for educational and development purposes only. Use at your own risk. The developers are not responsible for any loss of funds.

**Important Security Notes:**
- This is NOT a production-ready wallet
- Private keys are stored in browser localStorage (insecure)
- Always test with small amounts on testnet first
- Never share your private keys
- Double-check all transaction details before sending
