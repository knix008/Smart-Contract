# Ethereum Private Network with Kurtosis

This project provides a complete setup for running a Proof-of-Stake (PoS) Ethereum private network using Kurtosis, along with ERC-20 smart contract deployment capabilities.

## Overview

This setup uses **Kurtosis** to create a containerized Ethereum PoS network with:
- **Geth execution client** (HTTP RPC on port 8545)
- **Lighthouse consensus client** (RPC on port 4000)
- **Dora Block Explorer** (Web interface on port 8080)
- **Blockscout Explorer** (Web interface on port 4001)
- **Proof-of-Stake consensus mechanism**
- **Network ID**: 1337
- **Easy smart contract deployment**

## Project Structure

```
Ethereum/
├── README.md                # This documentation
├── SmartContract/           # ERC-20 smart contract project
│   ├── MyERC20Token.sol     # ERC-20 token contract
│   ├── package.json         # Node.js dependencies
│   ├── deploy.js            # Contract deployment script
│   └── README.md            # Smart contract documentation
└── kurtosis-setup/          # Kurtosis PoS network setup
    ├── start-kurtosis-pos.sh    # Main script to start Kurtosis PoS network
    ├── deploy-to-kurtosis.sh    # Script to deploy smart contracts
    └── README.md                # Kurtosis setup documentation
```

## Quick Start

### Prerequisites

1. **Docker** - Must be installed and running
2. **Node.js** - For smart contract deployment (if using deployment scripts)

### 1. Start the Kurtosis PoS Network

```bash
cd kurtosis-setup
./start-kurtosis-pos.sh start
```

This will:
- Pull the Kurtosis Ethereum module image
- Start the PoS network with Geth + Lighthouse
- Wait for the network to initialize
- Show network status

### 2. Deploy Smart Contracts

```bash
cd kurtosis-setup
./deploy-to-kurtosis.sh deploy
```

This will deploy your ERC-20 smart contract to the Kurtosis PoS network.

### 3. Check Network Status

```bash
./start-kurtosis-pos.sh status
```

## Network Management

### Available Commands

| Command | Description |
|---------|-------------|
| `./start-kurtosis-pos.sh start` | Start the Kurtosis PoS network |
| `./start-kurtosis-pos.sh stop` | Stop the Kurtosis PoS network |
| `./start-kurtosis-pos.sh status` | Show network status |
| `./start-kurtosis-pos.sh logs` | Show network logs |
| `./start-kurtosis-pos.sh restart` | Restart the network |
| `./start-kurtosis-pos.sh cleanup` | Stop and remove container |
| `./deploy-to-kurtosis.sh deploy` | Deploy smart contract |
| `./deploy-to-kurtosis.sh check` | Check if network is running |

## Network Endpoints

- **Geth RPC**: `http://localhost:8545`
- **Lighthouse RPC**: `http://localhost:4000`
- **Dora Block Explorer**: `http://localhost:8080`
- **Blockscout Explorer**: `http://localhost:4001`
- **Network ID**: 1337
- **Consensus**: Proof-of-Stake (PoS)

## Smart Contract Development

The project includes a complete ERC-20 smart contract setup:

1. **Contract**: `SmartContract/MyERC20Token.sol`
2. **Deployment**: Automated via Kurtosis deployment script
3. **Testing**: Built-in contract testing after deployment

### Manual Deployment

If you prefer manual deployment:

```bash
cd SmartContract
npm install
npm run deploy
```

## Features

- ✅ **PoS Consensus**: Real Proof-of-Stake consensus mechanism
- ✅ **Containerized**: Everything runs in Docker containers
- ✅ **Easy Setup**: One-command network startup
- ✅ **Smart Contract Ready**: Automated deployment scripts
- ✅ **Block Explorers**: Built-in Dora and Blockscout explorers
- ✅ **Production-like**: Uses real Ethereum clients (Geth + Lighthouse)
- ✅ **Development Friendly**: Pre-configured for local development

## Troubleshooting

### Network Issues

1. **Check Docker**: Ensure Docker is running (`docker ps`)
2. **Check Logs**: `./start-kurtosis-pos.sh logs`
3. **Restart Network**: `./start-kurtosis-pos.sh restart`

### Deployment Issues

1. **Check Network**: `./deploy-to-kurtosis.sh check`
2. **Verify Dependencies**: `cd SmartContract && npm install`
3. **Check Smart Contract**: Verify `MyERC20Token.sol` exists

### Port Conflicts

If ports 8545, 4000, 4001, or 8080 are in use:
```bash
# Check what's using the ports
netstat -tlnp | grep -E ":(8545|4000|4001|8080)"
# Stop the Kurtosis network
./start-kurtosis-pos.sh stop
```

## Security Notes

⚠️ **Important**: The deployment script uses a hardcoded private key for testing purposes only. Never use this in production!

For production deployments:
1. Use environment variables for private keys
2. Use proper key management solutions
3. Use testnet networks for development

## Advanced Usage

### Custom Configuration

Edit the `SERIALIZED_ARGS` in `start-kurtosis-pos.sh` to modify:
- Network ID
- Number of participants
- Client types (geth, lighthouse, teku, etc.)
- Additional services

### Multiple Networks

You can run multiple Kurtosis networks by:
1. Using different container names
2. Using different ports
3. Using different network IDs

## References

- [Kurtosis Documentation](https://docs.kurtosis.com/)
- [Ethereum PoS Guide](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/)
- [Geth Documentation](https://geth.ethereum.org/)
- [Lighthouse Documentation](https://lighthouse-book.sigmaprime.io/)

## Block Explorers

The network includes two block explorers for monitoring transactions and blocks:

### Dora Block Explorer
- **URL**: `http://localhost:8080`
- **Features**: Real-time block monitoring, transaction tracking, network statistics

### Blockscout Explorer  
- **URL**: `http://localhost:4001`
- **Features**: Advanced block explorer with contract verification, token tracking, and detailed analytics

## Support

If you encounter issues:

1. Check the logs: `./start-kurtosis-pos.sh logs`
2. Verify Docker is running: `docker info`
3. Check system resources
4. Try restarting: `./start-kurtosis-pos.sh restart`
5. Check block explorer status: `./start-kurtosis-pos.sh status`

## License

MIT License - Feel free to use this setup for your Ethereum development projects.