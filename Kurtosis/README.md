# Private PoS Ethereum Network with Kurtosis

This project sets up a private Proof-of-Stake (PoS) Ethereum network using Kurtosis and includes an ERC-20 smart contract deployment example.

## Overview

- **Network**: Private PoS Ethereum network with 2 nodes
- **Execution Layer**: Geth
- **Consensus Layer**: Lighthouse
- **Validators**: 128 total (64 per node)
- **Smart Contract**: ERC-20 token (MyToken - MTK) using OpenZeppelin v5

## Prerequisites

- Docker
- Kurtosis CLI
- Node.js (v22.x LTS recommended)

## Quick Start

### 1. Install Kurtosis and Dependencies

```bash
./install.sh
```

This will install:
- Docker (if not already installed)
- Kurtosis CLI

**Note**: If Docker was just installed, log out and log back in for group permissions to take effect.

### 2. Start the Private Ethereum Network

```bash
./start_network.sh
```

This will:
- Start the Kurtosis engine
- Deploy 2 Geth execution layer nodes
- Deploy 2 Lighthouse consensus layer nodes
- Deploy 2 Lighthouse validator clients
- Create 128 validators

### 3. Configure Environment Variables

```bash
cd SmartContract
cp .env.example .env
```

Edit `.env` to configure your network settings and private key. The default values work with the Kurtosis network.

**Important**: Never commit `.env` to git. It's already in `.gitignore`.

### 4. Deploy and Test Smart Contract

**Option A: Automated (Recommended)**

```bash
cd SmartContract
./deploy_and_test.sh
```

This single script will:
- Install dependencies if needed
- Clean previous builds
- Compile smart contracts
- Check network connectivity
- Deploy the contract
- Save the contract address to `.env`
- Run comprehensive tests

**Option B: Manual Steps**

```bash
cd SmartContract
npm install --legacy-peer-deps
npx hardhat compile
node scripts/deploy.js
node scripts/interact.js
```

The interaction script will:
- Read token information
- Transfer tokens
- Approve spending allowance
- Mint new tokens
- Burn tokens

## Network Configuration

### Network Details
- **Network ID**: 3151908
- **Seconds per Slot**: 12
- **Validators per Node**: 64
- **Chain**: Kurtosis (custom)

### Network Endpoints

After starting the network, use `kurtosis enclave inspect ethereum-net` to get the port mappings.

Example endpoints:
- **EL Node 1 RPC**: `http://127.0.0.1:PORT`
- **EL Node 2 RPC**: `http://127.0.0.1:PORT`
- **CL Node 1 Beacon API**: `http://127.0.0.1:PORT`
- **CL Node 2 Beacon API**: `http://127.0.0.1:PORT`

### Prefunded Accounts

The network comes with 20 prefunded accounts, each with **1 billion ETH**, derived from the mnemonic in [network_params.yaml](network_params.yaml).

**View all prefunded accounts:**

```bash
cd SmartContract
node scripts/get_accounts.js
```

This will display all 20 accounts with their addresses, private keys, and balances.

**First account (default):**
- **Address**: `0x8943545177806ED17B9F23F0a21ee5948eCaa776`
- **Private Key**: `0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31`
- **Balance**: 1,000,000,000 ETH
- **Derivation Path**: `m/44'/60'/0'/0/0`

You can use any of the 20 accounts by copying the private key to your `.env` file.

## Project Structure

```
.
├── install.sh                 # Installation script for Kurtosis and dependencies
├── start_network.sh           # Script to start the private Ethereum network
├── stop_network.sh            # Script to stop and clean up the network
├── network_params.yaml        # Network configuration parameters
├── .gitignore                 # Git ignore file
├── SmartContract/
│   ├── contracts/
│   │   └── MyToken.sol        # ERC-20 token contract
│   ├── scripts/
│   │   ├── deploy.js          # Deployment script
│   │   ├── interact.js        # Contract interaction test script
│   │   └── get_accounts.js    # Display all prefunded accounts
│   ├── deploy_and_test.sh     # Automated deploy and test script
│   ├── hardhat.config.js      # Hardhat configuration (uses .env)
│   ├── .env.example           # Environment variables template
│   ├── .env                   # Environment variables (git-ignored)
│   └── package.json           # NPM dependencies
└── README.md                  # This file
```

## Smart Contract

### MyToken (MTK)

An ERC-20 token contract using OpenZeppelin v5 with the following features:

- **Standard ERC20**: Transfer, approve, allowance, balanceOf
- **Burnable**: Token holders can burn their tokens
- **Mintable**: Owner can mint new tokens
- **Permit**: EIP-2612 gasless approvals
- **Initial Supply**: 1,000,000 MTK

**Deployed Contract Address**: Check console output after running `deploy.js`

### Contract Functions

- `transfer(address to, uint256 amount)` - Transfer tokens
- `approve(address spender, uint256 amount)` - Approve spending
- `mint(address to, uint256 amount)` - Mint new tokens (owner only)
- `burn(uint256 amount)` - Burn tokens
- `balanceOf(address account)` - Check balance
- `allowance(address owner, address spender)` - Check allowance

## Useful Commands

### Network Management

```bash
# View all services
kurtosis enclave inspect ethereum-net

# View service logs
kurtosis service logs ethereum-net <SERVICE_NAME>

# Get shell access to a service
kurtosis service shell ethereum-net <SERVICE_NAME>

# Stop the network
./stop_network.sh

# Open Kurtosis web UI
kurtosis web
```

### Smart Contract Development

```bash
cd SmartContract

# Deploy and test (automated)
./deploy_and_test.sh

# Compile contracts
npx hardhat compile

# Deploy contract
node scripts/deploy.js

# Run interaction tests
node scripts/interact.js

# View all prefunded accounts
node scripts/get_accounts.js

# Clean build artifacts
npx hardhat clean
```

### Environment Variables

The project uses a `.env` file for configuration. **Never commit this file to git.**

```bash
# Create .env from template
cp .env.example .env
```

**Environment variables:**
- `RPC_URL` - RPC endpoint of the Ethereum network
- `CHAIN_ID` - Network chain ID (3151908 for Kurtosis network)
- `PRIVATE_KEY` - Private key for the deployer account
- `CONTRACT_ADDRESS` - Deployed contract address (auto-set after deployment)

**Getting a different account:**
1. Run `node scripts/get_accounts.js` to see all 20 prefunded accounts
2. Copy any private key to your `.env` file
3. Save and use that account for deployments

## Network Customization

Edit [network_params.yaml](network_params.yaml) to customize:

- Number of participants (nodes)
- Execution/consensus client types (Geth, Nethermind, Besu, Erigon / Lighthouse, Prysm, Teku, Nimbus)
- Network parameters (network ID, slot duration, validators)
- Genesis configuration

After editing, restart the network:

```bash
./stop_network.sh
./start_network.sh
```

## Troubleshooting

### Port Conflicts

If you see "address already in use" errors:
1. Stop any existing Kurtosis instances: `kurtosis engine stop`
2. Check for processes using the ports: `netstat -tuln | grep <PORT>`
3. Kill conflicting processes or change the port configuration

### Docker Permission Issues

If you get Docker permission errors:
1. Add your user to the docker group: `sudo usermod -aG docker $USER`
2. Log out and log back in

### Hardhat Compilation Issues

If compilation fails:
- Ensure you're using Node.js v22.x LTS
- Try cleaning: `npx hardhat clean`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install --legacy-peer-deps`

### Environment Variable Issues

If you get "not found in .env file" errors:
1. Make sure `.env` exists: `cp .env.example .env`
2. Update the RPC_URL port to match your running network
3. Check the port with: `kurtosis enclave inspect ethereum-net`
4. Update `.env` with the correct port number

### Contract Deployment Issues

If deployment fails:
- Ensure the network is running: `./start_network.sh`
- Check network connectivity with the deploy script
- Verify your private key has sufficient balance
- Check the RPC_URL in `.env` matches the actual port

## References

- [Kurtosis Documentation](https://docs.kurtosis.com/)
- [Ethereum Package by EthPandaOps](https://github.com/ethpandaops/ethereum-package)
- [Hardhat Documentation](https://hardhat.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)

## License

ISC
