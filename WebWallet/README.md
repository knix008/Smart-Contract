# Ethereum Wallet Generator

A React application for creating3. **Save Wallet**:
   - After creating a wallet, click "💾 Save Wallet" to store it locally
   - A backup JSON file will automatically download to your computer
   - Saved wallets are stored in browser localStorage

4. **Manage Saved Wallets**:
   - Click "📂 Show Saved Wallets" to view all saved wallets
   - Use "📥 Load" to switch to a saved wallet
   - Use "🗑️ Delete" to remove a wallet from storage

5. **Check Balance**:
   - After creating or loading a wallet, click "💰 Check Balance"
   - The app will connect to Ethereum mainnet and display the current ETH balance

6. **Copy Wallet Information**:Ethereum wallets and checking their balances.

## Features

- 🔑 **Generate New Wallets**: Create completely new Ethereum wallets with random private keys
- 💰 **Check Balances**: View ETH balance for any generated wallet
- � **Save Wallets**: Save wallet information locally with automatic backup downloads
- 📂 **Wallet Management**: Load, view, and delete saved wallets
- �📋 **Copy Functionality**: Easy copy-to-clipboard for addresses, private keys, and mnemonic phrases
- 🔐 **Security Warnings**: Built-in reminders about wallet security best practices
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌙 **Dark Mode Support**: Automatic dark/light mode based on system preferences
- 📄 **Backup Files**: Automatic JSON backup file downloads for wallet data

## What This App Does

1. **Wallet Creation**: Generates a new Ethereum wallet with:
   - Public address (for receiving funds)
   - Private key (for accessing the wallet)
   - 12-word mnemonic phrase (for wallet recovery)

2. **Balance Checking**: Connects to Ethereum mainnet to check the ETH balance of generated wallets

3. **User Interface**: Provides a clean, intuitive web interface for all wallet operations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How to Use

1. **Create a New Wallet**:
   - Click the "🔑 Create New Wallet" button
   - A new wallet will be generated with a unique address, private key, and mnemonic phrase

2. **Check Balance**:
   - After creating a wallet, click "💰 Check Balance"
   - The app will connect to Ethereum mainnet and display the current ETH balance

3. **Copy Wallet Information**:
   - Use the "📋 Copy" buttons to copy address, private key, or mnemonic phrase
   - Store this information securely!

## Important Security Notes

⚠️ **This application is for educational purposes only**

- **Never use generated wallets for real funds without proper security measures**
- **Private keys and mnemonic phrases give full access to wallets**
- **Always use hardware wallets or established wallet software for significant amounts**
- **This app generates wallets client-side, but for maximum security, use offline generation**

## Technical Details

### Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **ethers.js** for Ethereum blockchain interactions
- **CSS3** with responsive design and dark mode support

### Blockchain Integration

- Uses ethers.js library for wallet generation and blockchain interactions
- Connects to Ethereum mainnet via public RPC endpoints
- Generates wallets using cryptographically secure random number generation

### Wallet Storage

- **Local Storage**: Wallets are saved in browser localStorage for easy access
- **Backup Files**: Each save operation creates a downloadable JSON backup file
- **File Format**: Backup files contain all wallet information in JSON format
- **File Location**: Downloads go to your browser's default download folder
- **Security**: Local storage is browser-specific and not shared across devices

### Backup File Structure

```json
{
  "wallets": [
    {
      "address": "0x...",
      "privateKey": "0x...",
      "mnemonic": "word1 word2 ...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "name": "Wallet 1"
    }
  ]
}
```

### Network Configuration

The app currently uses Ethereum mainnet. To use testnets:

1. Modify the provider URL in `src/App.tsx`
2. Replace `https://eth.llamarpc.com` with:
   - Sepolia testnet: `https://rpc.sepolia.org`
   - Goerli testnet: `https://goerli.infura.io/v3/YOUR_PROJECT_ID`

## Development

### Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── main.tsx         # Application entry point
├── index.css        # Global styles
└── vite-env.d.ts    # Vite type definitions
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