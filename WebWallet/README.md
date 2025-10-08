# Ethereum Wallet & Smart Contract Manager# Ethereum Wallet & Smart Contract Manager# Ethereum Wallet Gene- 💾 **Save Wallets**: Save wallet information locally with automatic backup downloads



A comprehensive React application for Ethereum wallet management and smart contract deployment/testing. Built with TypeScript, Vite, and ethers.js.- 📄 **Export to .env**: Export wallets as environment variables for development use



## 🌟 FeaturesA comprehensive React application for Ethereum wallet management and smart contract deployment/testing. Built with TypeScript, Vite, and ethers.js.- 📥 **Import from .env**: Import existing wallets from .env files



### 💼 Wallet Management- 📂 **Wallet Management**: Load, view, and delete saved walletstor

- **Create New Wallets**: Generate secure Ethereum wallets with random private keys and mnemonic phrases

- **Balance Checking**: Check ETH balances on Ethereum mainnet## 🌟 Features

- **Local Storage**: Save and manage multiple wallets in browser storage

- **JSON Backup**: Automatic JSON backup files for wallet dataA React application for creating3. **Save Wallet**:

- **Security**: Never stores sensitive data in plain text unnecessarily

### 💼 Wallet Management   - After creating a wallet, click "💾 Save Wallet" to store it locally

### 📋 Smart Contract Management

- **Web Interface**: Deploy and test smart contracts directly from the browser- **Create New Wallets**: Generate secure Ethereum wallets with random private keys and mnemonic phrases   - A backup JSON file will automatically download to your computer

- **Contract Testing**: Interactive testing interface for deployed contracts

- **Deployment History**: Track all deployed contracts with Etherscan links- **Balance Checking**: Check ETH balances on Ethereum mainnet   - Saved wallets are stored in browser localStorage

- **Function Execution**: Call contract functions with real-time results

- **Local Storage**: Save and manage multiple wallets in browser storage

### 🔧 Development Environment

- **Hardhat Integration**: Complete smart contract development setup- **File Export/Import**: Export wallets to .env files and import from existing .env files4. **Manage Saved Wallets**:

- **Solidity Support**: Contracts written in Solidity 0.8.19/0.8.20

- **Testing Framework**: Automated contract testing with detailed results- **JSON Backup**: Automatic JSON backup files for wallet data   - Click "📂 Show Saved Wallets" to view all saved wallets

- **Sepolia Testnet**: Deploy and test on Ethereum Sepolia testnet

- **Security**: Never stores sensitive data in plain text unnecessarily   - Use "📥 Load" to switch to a saved wallet

## 📦 Installation

   - Use "🗑️ Delete" to remove a wallet from storage

1. **Clone the repository**:

```bash### 📋 Smart Contract Management

git clone <repository-url>

cd WebWallet- **Web Interface**: Deploy and test smart contracts directly from the browser5. **Export to .env**:

```

- **MetaMask Integration**: Connect with MetaMask for secure transaction signing   - Click "📄 Export to .env" to download wallets as environment variables

2. **Install dependencies**:

```bash- **Multiple Contracts**: Support for SimpleWallet, WalletFactory, and WalletToken contracts   - Use these .env files in your development projects

npm install

```- **Contract Testing**: Interactive testing interface for deployed contracts   - Perfect for hardcoding wallet addresses in smart contract projects



3. **Install smart contract dependencies**:- **Deployment History**: Track all deployed contracts with Etherscan links

```bash

cd smartcontracts- **Function Execution**: Call contract functions with real-time results6. **Import from .env**:

npm install

cd ..   - Click "📥 Import from .env" to load wallets from existing .env files

```

### 🔧 Development Environment   - Select any .env file containing wallet variables

## 🚀 Usage

- **Hardhat Integration**: Complete smart contract development setup   - Automatically detects and imports valid wallet data

### Running the Application

- **Solidity Support**: Contracts written in Solidity 0.8.19/0.8.20

1. **Start the development server**:

```bash- **OpenZeppelin**: Secure contract implementations using OpenZeppelin libraries7. **Check Balance**:

npm run dev

```- **Test Suite**: Comprehensive test coverage (21/21 tests passing)   - After creating or loading a wallet, click "💰 Check Balance"



2. **Open your browser**:- **Sepolia Testnet**: Configured for Sepolia testnet deployment via Infura   - The app will connect to Ethereum mainnet and display the current ETH balance

Navigate to `http://localhost:5173`



### Using the Wallet Manager

## 🚀 Quick Start8. **Copy Wallet Information**:Ethereum wallets and checking their balances.

1. **Create a New Wallet**:

   - Click "🎲 Generate New Wallet" on the Wallet Manager tab

   - A new wallet with address, private key, and mnemonic will be generated

   - The wallet balance will be automatically checked### Prerequisites## Features



2. **Save Wallet**:- Node.js (v16 or higher)

   - After creating a wallet, click "💾 Save Wallet" to store it locally

   - A backup JSON file will automatically download to your computer- npm or yarn- 🔑 **Generate New Wallets**: Create completely new Ethereum wallets with random private keys

   - Saved wallets are stored in browser localStorage

- MetaMask browser extension (for smart contract features)- 💰 **Check Balances**: View ETH balance for any generated wallet

3. **Manage Saved Wallets**:

   - Click "📂 Show Saved Wallets" to view all saved wallets- � **Save Wallets**: Save wallet information locally with automatic backup downloads

   - Use "📥 Load" to switch to a saved wallet

   - Use "🗑️ Delete" to remove a wallet from storage### Installation- 📂 **Wallet Management**: Load, view, and delete saved wallets



### Using the Smart Contract Manager- �📋 **Copy Functionality**: Easy copy-to-clipboard for addresses, private keys, and mnemonic phrases



1. **Connect Wallet**:1. **Clone the repository**- 🔐 **Security Warnings**: Built-in reminders about wallet security best practices

   - First create or load a wallet in the Wallet Manager tab

   - Switch to the Smart Contract Manager tab   ```bash- 📱 **Responsive Design**: Works on desktop and mobile devices

   - Your wallet will be automatically connected

   git clone <repository-url>- 🌙 **Dark Mode Support**: Automatic dark/light mode based on system preferences

2. **Compile Contracts**:

   - Click "🔨 Compile Contracts" to compile the smart contracts   cd WebWallet- 📄 **Backup Files**: Automatic JSON backup file downloads for wallet data

   - This uses Hardhat to compile Solidity contracts

   ```

3. **Run Tests**:

   - Click "🧪 Run Tests" to execute the test suite## What This App Does

   - View detailed test results with pass/fail status for each test case

   - Tests include comprehensive contract functionality verification2. **Install dependencies**



4. **Deploy Contracts**:   ```bash1. **Wallet Creation**: Generates a new Ethereum wallet with:

   - Click "🚀 Deploy to Sepolia" to deploy contracts to the testnet

   - Monitor deployment progress and view transaction details   npm install   - Public address (for receiving funds)

   - Deployed contracts will appear in the deployment history

   ```   - Private key (for accessing the wallet)

## 🏗️ Architecture

   - 12-word mnemonic phrase (for wallet recovery)

### Frontend (React + TypeScript)

- **Vite**: Fast build tool and development server3. **Set up environment variables**

- **ethers.js**: Ethereum library for wallet and contract interactions

- **React**: Component-based UI framework   ```bash2. **Balance Checking**: Connects to Ethereum mainnet to check the ETH balance of generated wallets

- **TypeScript**: Type-safe JavaScript

   cp .env.example .env

### Smart Contracts (Solidity)

- **Hardhat**: Development environment for Ethereum   # Edit .env with your Infura project ID and deployment private key3. **User Interface**: Provides a clean, intuitive web interface for all wallet operations

- **OpenZeppelin**: Secure smart contract library

- **Solidity**: Smart contract programming language   ```



### Key Components## Getting Started

- `App.tsx`: Main application component with tab navigation

- `SmartContractManager.tsx`: Smart contract deployment and testing4. **Compile smart contracts**

- `envManager.ts`: Wallet management utilities

- `contracts/`: Solidity smart contracts   ```bash### Prerequisites

- `test/`: Contract test suites

   cd smartcontracts

## 🔒 Security Features

   npm install- Node.js (version 16 or higher)

- **Client-side Only**: All wallet operations happen in your browser

- **No Server**: No data is sent to external servers   npx hardhat compile- npm or yarn package manager

- **Local Storage**: Wallet data stays on your device

- **Backup Files**: Automatic JSON backups for safety   ```

- **Private Key Protection**: Private keys are never exposed unnecessarily

### Installation

## 🌐 Network Configuration

5. **Run tests (optional)**

The application is pre-configured with:

- **Sepolia Testnet**: For testing and development   ```bash1. Install dependencies:

- **Infura RPC**: Reliable Ethereum node access

- **Automatic Network Detection**: Smart network switching   npx hardhat test```bash



## 📝 Smart Contract Features   ```npm install



### MyERC20Token Contract```

- **ERC20 Standard**: Fully compliant ERC20 token

- **Pausable**: Emergency pause functionality6. **Start the development server**

- **Burnable**: Token burning capability

- **Flash Mint**: Advanced minting features   ```bash2. Start the development server:

- **Permit**: Gas-efficient approvals

   cd ..```bash

### Testing Suite

- Comprehensive test coverage   npm run devnpm run dev

- Ownership verification

- Token functionality testing   ``````

- Pause/unpause mechanics

- Transfer restrictions

- Burn functionality

7. **Open the application**3. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Development

   - Navigate to `http://localhost:5173`

### Smart Contract Development

   - Use the **Wallet Manager** tab for wallet operations### Available Scripts

1. **Navigate to contracts directory**:

```bash   - Use the **Smart Contracts** tab for contract deployment and testing

cd smartcontracts

```- `npm run dev` - Start development server



2. **Compile contracts**:## 📖 Usage Guide- `npm run build` - Build for production

```bash

npx hardhat compile- `npm run preview` - Preview production build

```

### Wallet Manager Tab- `npm run lint` - Run ESLint

3. **Run tests**:

```bash

npx hardhat test

```#### Creating a New Wallet## How to Use



4. **Deploy to Sepolia** (requires setup):1. Click "🔑 Create New Wallet"

```bash

npx hardhat run scripts/deploy.js --network sepolia2. A new wallet will be generated with:1. **Create a New Wallet**:

```

   - Ethereum address   - Click the "🔑 Create New Wallet" button

### Frontend Development

   - Private key (keep secure!)   - A new wallet will be generated with a unique address, private key, and mnemonic phrase

1. **Start development server**:

```bash   - 12-word mnemonic phrase

npm run dev

```   - Creation timestamp2. **Check Balance**:



2. **Build for production**:   - After creating a wallet, click "💰 Check Balance"

```bash

npm run build#### Checking Balance   - The app will connect to Ethereum mainnet and display the current ETH balance

```

1. Create or load a wallet

3. **Preview production build**:

```bash2. Click "💰 Check Balance"3. **Copy Wallet Information**:

npm run preview

```3. Balance will be displayed in ETH   - Use the "📋 Copy" buttons to copy address, private key, or mnemonic phrase



## 📚 Documentation   - Store this information securely!



### Wallet Management#### Saving Wallets

The wallet manager provides a secure way to:

- Generate cryptographically secure wallets1. After creating a wallet, click "💾 Save Wallet"## Important Security Notes

- Store wallets locally with encryption

- Export wallet data for development use2. Wallet will be stored in browser's local storage

- Import existing wallet data

3. Automatic JSON backup file will be created⚠️ **This application is for educational purposes only**

### Smart Contract Integration

Smart contracts are integrated through:

- Hardhat compilation system

- Automated testing framework#### Managing Saved Wallets- **Never use generated wallets for real funds without proper security measures**

- Deployment to testnets

- Interactive contract interfaces1. Click "📂 Show Saved Wallets" to view all saved wallets- **Private keys and mnemonic phrases give full access to wallets**



## 🤝 Contributing2. Load any wallet by clicking its "Load" button- **Always use hardware wallets or established wallet software for significant amounts**



1. Fork the repository3. Delete wallets using the "Delete" button (irreversible)- **This app generates wallets client-side, but for maximum security, use offline generation**

2. Create a feature branch

3. Make your changes

4. Add tests if applicable

5. Submit a pull request#### File Operations## Technical Details



## 📄 License- **Export to .env**: Click "📄 Export to .env" to create an environment file



This project is open source and available under the MIT License.- **Import from .env**: Click "📥 Import from .env" to load wallets from an existing .env file### Technologies Used



## 🆘 Support



For issues and questions:### Smart Contracts Tab- **React 18** with TypeScript

1. Check the documentation

2. Review existing issues- **Vite** for fast development and building

3. Create a new issue with detailed information

#### Connecting MetaMask- **ethers.js** for Ethereum blockchain interactions

## 🔗 Useful Links

1. Click "Connect MetaMask"- **CSS3** with responsive design and dark mode support

- [Ethers.js Documentation](https://docs.ethers.org/)

- [Hardhat Documentation](https://hardhat.org/docs)2. Approve the connection in MetaMask

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)

- [Solidity Documentation](https://docs.soliditylang.org/)3. Your wallet address and balance will be displayed### Blockchain Integration



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