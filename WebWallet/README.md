# Ethereum Wallet & Smart Contract Manager# Ethereum Wallet Gene- 💾 **Save Wallets**: Save wallet information locally with automatic backup downloads

- 📄 **Export to .env**: Export wallets as environment variables for development use

A comprehensive React application for Ethereum wallet management and smart contract deployment/testing. Built with TypeScript, Vite, and ethers.js.- 📥 **Import from .env**: Import existing wallets from .env files

- 📂 **Wallet Management**: Load, view, and delete saved walletstor

## 🌟 Features

A React application for creating3. **Save Wallet**:

### 💼 Wallet Management   - After creating a wallet, click "💾 Save Wallet" to store it locally

- **Create New Wallets**: Generate secure Ethereum wallets with random private keys and mnemonic phrases   - A backup JSON file will automatically download to your computer

- **Balance Checking**: Check ETH balances on Ethereum mainnet   - Saved wallets are stored in browser localStorage

- **Local Storage**: Save and manage multiple wallets in browser storage

- **File Export/Import**: Export wallets to .env files and import from existing .env files4. **Manage Saved Wallets**:

- **JSON Backup**: Automatic JSON backup files for wallet data   - Click "📂 Show Saved Wallets" to view all saved wallets

- **Security**: Never stores sensitive data in plain text unnecessarily   - Use "📥 Load" to switch to a saved wallet

   - Use "🗑️ Delete" to remove a wallet from storage

### 📋 Smart Contract Management

- **Web Interface**: Deploy and test smart contracts directly from the browser5. **Export to .env**:

- **MetaMask Integration**: Connect with MetaMask for secure transaction signing   - Click "📄 Export to .env" to download wallets as environment variables

- **Multiple Contracts**: Support for SimpleWallet, WalletFactory, and WalletToken contracts   - Use these .env files in your development projects

- **Contract Testing**: Interactive testing interface for deployed contracts   - Perfect for hardcoding wallet addresses in smart contract projects

- **Deployment History**: Track all deployed contracts with Etherscan links

- **Function Execution**: Call contract functions with real-time results6. **Import from .env**:

   - Click "📥 Import from .env" to load wallets from existing .env files

### 🔧 Development Environment   - Select any .env file containing wallet variables

- **Hardhat Integration**: Complete smart contract development setup   - Automatically detects and imports valid wallet data

- **Solidity Support**: Contracts written in Solidity 0.8.19/0.8.20

- **OpenZeppelin**: Secure contract implementations using OpenZeppelin libraries7. **Check Balance**:

- **Test Suite**: Comprehensive test coverage (21/21 tests passing)   - After creating or loading a wallet, click "💰 Check Balance"

- **Sepolia Testnet**: Configured for Sepolia testnet deployment via Infura   - The app will connect to Ethereum mainnet and display the current ETH balance



## 🚀 Quick Start8. **Copy Wallet Information**:Ethereum wallets and checking their balances.



### Prerequisites## Features

- Node.js (v16 or higher)

- npm or yarn- 🔑 **Generate New Wallets**: Create completely new Ethereum wallets with random private keys

- MetaMask browser extension (for smart contract features)- 💰 **Check Balances**: View ETH balance for any generated wallet

- � **Save Wallets**: Save wallet information locally with automatic backup downloads

### Installation- 📂 **Wallet Management**: Load, view, and delete saved wallets

- �📋 **Copy Functionality**: Easy copy-to-clipboard for addresses, private keys, and mnemonic phrases

1. **Clone the repository**- 🔐 **Security Warnings**: Built-in reminders about wallet security best practices

   ```bash- 📱 **Responsive Design**: Works on desktop and mobile devices

   git clone <repository-url>- 🌙 **Dark Mode Support**: Automatic dark/light mode based on system preferences

   cd WebWallet- 📄 **Backup Files**: Automatic JSON backup file downloads for wallet data

   ```

## What This App Does

2. **Install dependencies**

   ```bash1. **Wallet Creation**: Generates a new Ethereum wallet with:

   npm install   - Public address (for receiving funds)

   ```   - Private key (for accessing the wallet)

   - 12-word mnemonic phrase (for wallet recovery)

3. **Set up environment variables**

   ```bash2. **Balance Checking**: Connects to Ethereum mainnet to check the ETH balance of generated wallets

   cp .env.example .env

   # Edit .env with your Infura project ID and deployment private key3. **User Interface**: Provides a clean, intuitive web interface for all wallet operations

   ```

## Getting Started

4. **Compile smart contracts**

   ```bash### Prerequisites

   cd smartcontracts

   npm install- Node.js (version 16 or higher)

   npx hardhat compile- npm or yarn package manager

   ```

### Installation

5. **Run tests (optional)**

   ```bash1. Install dependencies:

   npx hardhat test```bash

   ```npm install

```

6. **Start the development server**

   ```bash2. Start the development server:

   cd ..```bash

   npm run devnpm run dev

   ``````



7. **Open the application**3. Open your browser and navigate to `http://localhost:5173`

   - Navigate to `http://localhost:5173`

   - Use the **Wallet Manager** tab for wallet operations### Available Scripts

   - Use the **Smart Contracts** tab for contract deployment and testing

- `npm run dev` - Start development server

## 📖 Usage Guide- `npm run build` - Build for production

- `npm run preview` - Preview production build

### Wallet Manager Tab- `npm run lint` - Run ESLint



#### Creating a New Wallet## How to Use

1. Click "🔑 Create New Wallet"

2. A new wallet will be generated with:1. **Create a New Wallet**:

   - Ethereum address   - Click the "🔑 Create New Wallet" button

   - Private key (keep secure!)   - A new wallet will be generated with a unique address, private key, and mnemonic phrase

   - 12-word mnemonic phrase

   - Creation timestamp2. **Check Balance**:

   - After creating a wallet, click "💰 Check Balance"

#### Checking Balance   - The app will connect to Ethereum mainnet and display the current ETH balance

1. Create or load a wallet

2. Click "💰 Check Balance"3. **Copy Wallet Information**:

3. Balance will be displayed in ETH   - Use the "📋 Copy" buttons to copy address, private key, or mnemonic phrase

   - Store this information securely!

#### Saving Wallets

1. After creating a wallet, click "💾 Save Wallet"## Important Security Notes

2. Wallet will be stored in browser's local storage

3. Automatic JSON backup file will be created⚠️ **This application is for educational purposes only**



#### Managing Saved Wallets- **Never use generated wallets for real funds without proper security measures**

1. Click "📂 Show Saved Wallets" to view all saved wallets- **Private keys and mnemonic phrases give full access to wallets**

2. Load any wallet by clicking its "Load" button- **Always use hardware wallets or established wallet software for significant amounts**

3. Delete wallets using the "Delete" button (irreversible)- **This app generates wallets client-side, but for maximum security, use offline generation**



#### File Operations## Technical Details

- **Export to .env**: Click "📄 Export to .env" to create an environment file

- **Import from .env**: Click "📥 Import from .env" to load wallets from an existing .env file### Technologies Used



### Smart Contracts Tab- **React 18** with TypeScript

- **Vite** for fast development and building

#### Connecting MetaMask- **ethers.js** for Ethereum blockchain interactions

1. Click "Connect MetaMask"- **CSS3** with responsive design and dark mode support

2. Approve the connection in MetaMask

3. Your wallet address and balance will be displayed### Blockchain Integration



#### Deploying Contracts- Uses ethers.js library for wallet generation and blockchain interactions

1. Connect your MetaMask wallet- Connects to Ethereum mainnet via public RPC endpoints

2. Choose from available contracts:- Generates wallets using cryptographically secure random number generation

   - **SimpleWallet**: Basic wallet with owner functionality

   - **WalletFactory**: Factory for creating multiple wallet instances### Wallet Storage

   - **WalletToken**: ERC20 token implementation

3. Click "Deploy" for individual contracts or "Deploy All Contracts"- **Local Storage**: Wallets are saved in browser localStorage for easy access

4. Confirm transactions in MetaMask- **Backup Files**: Each save operation creates a downloadable JSON backup file

- **File Format**: Backup files contain all wallet information in JSON format

#### Testing Contracts- **File Location**: Downloads go to your browser's default download folder

1. Select a deployed contract from the dropdown- **Security**: Local storage is browser-specific and not shared across devices

2. Available functions will be displayed as buttons

3. Click any function button to execute (read-only functions are free)### .env File Integration

4. Results will be displayed in the interactions history

The application now supports importing and exporting wallet data as `.env` files for development use.

#### Viewing Deployment History

- All deployed contracts are listed with their addresses#### .env File Format

- Click "View on Etherscan" to see contract details on Etherscan

- Load contracts by address for testing```env

# Ethereum Wallet Environment Variables

## 🏗 Technical Architecture# WARNING: Never commit this file to version control!



### Frontend Stack# Network Configuration

- **React 18**: Modern React with hooksVITE_ETHEREUM_RPC_URL=https://eth.llamarpc.com

- **TypeScript**: Type-safe developmentVITE_NETWORK_NAME=mainnet

- **Vite**: Fast build tool and dev server

- **ethers.js v6**: Ethereum blockchain interactions# Wallet 1

- **CSS3**: Responsive design with dark mode supportWALLET_1_ADDRESS=0x1234567890123456789012345678901234567890

WALLET_1_PRIVATE_KEY=0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890

### Smart ContractsWALLET_1_MNEMONIC="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"

- **Solidity**: Smart contract programming language```

- **Hardhat**: Development environment and testing framework

- **OpenZeppelin**: Security-audited contract libraries#### Usage in Development

- **Sepolia Testnet**: Ethereum testnet for safe testing

```typescript

### Project Structure// Access wallet data in your React app

```const walletAddress = import.meta.env.VITE_WALLET_1_ADDRESS;

WebWallet/const privateKey = import.meta.env.VITE_WALLET_1_PRIVATE_KEY;

├── src/const mnemonic = import.meta.env.VITE_WALLET_1_MNEMONIC;

│   ├── App.tsx                 # Main application component```

│   ├── App.css                 # Application styles

│   ├── SmartContractManager.tsx # Smart contract interface#### Security Best Practices

│   ├── SmartContractManager.css # Smart contract styles

│   ├── types.ts                # TypeScript type definitions- ⚠️ **Never commit .env files to version control**

│   └── envManager.ts           # .env file management utilities- 📁 Add `.env*` to your `.gitignore` file

├── smartcontracts/- 🔐 Store .env files securely and separately from your code

│   ├── contracts/              # Solidity smart contracts- 🚫 Don't use production private keys in development .env files

│   ├── scripts/                # Deployment scripts

│   ├── test/                   # Test files### JSON Backup File Structure

│   └── hardhat.config.js       # Hardhat configuration

└── package.json               # Project dependencies```json

```{

  "wallets": [

## 🔒 Security Considerations    {

      "address": "0x...",

### Wallet Security      "privateKey": "0x...",

- **Private Keys**: Never share your private keys or mnemonic phrases      "mnemonic": "word1 word2 ...",

- **Local Storage**: Wallet data is stored locally in your browser      "createdAt": "2024-01-01T00:00:00.000Z",

- **Production Use**: This is for educational purposes; use hardware wallets for significant funds      "name": "Wallet 1"

- **.env Files**: Never commit .env files to version control    }

  ]

### Smart Contract Security}

- **Testnet First**: Always test on Sepolia testnet before mainnet deployment```

- **Gas Costs**: Be aware of gas costs for contract deployment and interactions

- **Contract Verification**: Verify contracts on Etherscan after deployment### Network Configuration

- **Access Control**: Smart contracts include proper access controls and ownership

The app currently uses Ethereum mainnet. To use testnets:

## 🛠 Development

1. Modify the provider URL in `src/App.tsx`

### Running Tests2. Replace `https://eth.llamarpc.com` with:

```bash   - Sepolia testnet: `https://rpc.sepolia.org`

cd smartcontracts   - Goerli testnet: `https://goerli.infura.io/v3/YOUR_PROJECT_ID`

npx hardhat test

```## Smart Contract Integration



### Deploying to Sepolia TestnetThe application includes production-ready Solidity smart contracts in the `smartcontracts/` directory:

1. Get Sepolia ETH from faucets:

   - [Sepolia Faucet](https://sepoliafaucet.com/)### 📋 Available Contracts (All Tests Passing ✅)

   - [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

1. **SimpleWallet.sol**: Secure wallet contract for receiving and sending Ether

2. Configure .env file:2. **WalletFactory.sol**: Factory contract for deploying multiple wallet instances  

   ```env3. **WalletToken.sol**: ERC20 token for the wallet ecosystem (1M supply)

   INFURA_PROJECT_ID=your_infura_project_id

   DEPLOYER_PRIVATE_KEY=your_deployer_private_key### 🚀 Deployment Status

   ```

- **Compilation**: ✅ Successful (Solidity 0.8.19/0.8.20)

3. Deploy contracts:- **Testing**: ✅ 21/21 tests passing

   ```bash- **Sepolia Config**: ✅ Ready for deployment

   cd smartcontracts- **Current Status**: Awaiting Sepolia ETH for gas fees

   npx hardhat run scripts/deploy.js --network sepolia

   ```### 🔧 Quick Start with Smart Contracts



### Adding New Contracts```bash

1. Create contract in `smartcontracts/contracts/`# Navigate to smart contracts directory

2. Add deployment logic to `scripts/deploy.js`cd smartcontracts

3. Write tests in `smartcontracts/test/`

4. Update the smart contract manager interface# Install dependencies

npm install

## 🌐 Network Configuration

# Compile contracts

### Supported Networksnpm run compile

- **Ethereum Mainnet**: For balance checking (read-only)

- **Sepolia Testnet**: For contract deployment and testing# Run tests

- **Local Development**: Hardhat local network for developmentnpm run test



### RPC Endpoints# Check deployment account balance

- **Mainnet**: `https://eth.llamarpc.com`npm run balance:sepolia

- **Sepolia**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

# Deploy to Sepolia (after getting testnet ETH)

## 📝 Licensenpm run deploy:sepolia

```

This project is for educational purposes. Please ensure you understand the security implications before using with real funds.

### 💰 Getting Testnet ETH

## 🤝 Contributing

**Deployment Account**: `0x8bB041C96042646a04abd0f2Cdb6f1316cDC507b`

1. Fork the repository**Required Amount**: ~0.0005 ETH

2. Create a feature branch

3. Make your changes**Sepolia Faucets**:

4. Add tests if applicable- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

5. Submit a pull request- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

- [ChainLink Sepolia Faucet](https://faucets.chain.link/sepolia)

## 📞 Support

See `smartcontracts/README.md` for detailed documentation and deployment instructions.

For issues or questions:

1. Check the console for error messages## Development

2. Ensure MetaMask is installed and connected

3. Verify you have sufficient ETH for gas fees### Project Structure

4. Check network connectivity

```

---WebWallet/

├── src/                    # React application source

**⚠️ Important**: This application is for educational and development purposes. Always use testnet for experiments and never share private keys or mnemonic phrases.│   ├── App.tsx            # Main wallet component
│   ├── envManager.ts      # .env file management
│   ├── types.ts           # TypeScript interfaces
│   └── ...
├── smartcontracts/        # Solidity smart contracts
│   ├── contracts/         # Contract source files
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Contract tests
│   └── README.md          # Smart contract documentation
├── dist/                  # Built application
├── package.json           # React app dependencies
├── vite.config.ts         # Vite configuration
└── README.md              # This file
```

### Key Components

- **Wallet Creation**: Uses `ethers.Wallet.createRandom()` for secure wallet generation
- **Balance Checking**: Connects to Ethereum RPC endpoints to fetch balances
- **UI Components**: Responsive React components with TypeScript

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. Use at your own risk.

## Disclaimer

This wallet generator is a learning tool. For production use:
- Use established wallet software
- Follow proper security practices
- Never share private keys or mnemonic phrases
- Consider hardware wallets for significant funds