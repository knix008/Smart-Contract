# Kurtosis PoS Ethereum Private Network

This directory contains scripts to easily set up and manage a Proof-of-Stake (PoS) Ethereum private network using Kurtosis.

## Overview

Kurtosis is a container-based tool that simplifies the setup of complex distributed systems, including Ethereum networks. This setup provides:

- **Geth execution client** (HTTP RPC on port 8545)
- **Lighthouse consensus client** (RPC on port 4000)
- **Dora Block Explorer** (Web interface on port 8080)
- **Blockscout Explorer** (Web interface on port 4001)
- **Proof-of-Stake consensus mechanism**
- **Network ID**: 1337
- **Easy smart contract deployment**

## Prerequisites

1. **Docker** - Must be installed and running
2. **Node.js** - For smart contract deployment (if using deployment scripts)

## Quick Start

### 1. Start the Kurtosis PoS Network

```bash
./start-kurtosis-pos.sh start
```

This will:
- Pull the Kurtosis Ethereum module image
- Start the PoS network with Geth + Lighthouse
- Wait for the network to initialize
- Show network status

### 2. Check Network Status

```bash
./start-kurtosis-pos.sh status
```

### 3. Deploy Smart Contracts

```bash
./deploy-to-kurtosis.sh deploy
```

This will deploy your ERC-20 smart contract to the Kurtosis PoS network.

## Available Commands

### Network Management (`start-kurtosis-pos.sh`)

| Command | Description |
|---------|-------------|
| `start` | Start the Kurtosis PoS network |
| `stop` | Stop the Kurtosis PoS network |
| `status` | Show network status |
| `logs` | Show network logs |
| `restart` | Restart the network |
| `cleanup` | Stop and remove container |
| `help` | Show help message |

### Smart Contract Deployment (`deploy-to-kurtosis.sh`)

| Command | Description |
|---------|-------------|
| `deploy` | Deploy smart contract to Kurtosis PoS network |
| `check` | Check if Kurtosis network is running |
| `help` | Show help message |

## Network Configuration

The network is configured with:

```json
{
  "enclaveId": "ethereum-pos-network",
  "participants": [
    {
      "el_type": "geth",
      "cl_type": "lighthouse",
      "count": 1
    }
  ],
  "network_params": {
    "network_id": "1337"
  },
  "additional_services": ["dora", "blockscout"]
}
```

## Endpoints

- **Geth RPC**: `http://localhost:8545`
- **Lighthouse RPC**: `http://localhost:4000`
- **Dora Block Explorer**: `http://localhost:8080`
- **Blockscout Explorer**: `http://localhost:4001`
- **Network ID**: 1337
- **Consensus**: Proof-of-Stake (PoS)

## Usage Examples

### Start the network and deploy a contract

```bash
# Start the Kurtosis PoS network
./start-kurtosis-pos.sh start

# Wait for network to be ready, then deploy
./deploy-to-kurtosis.sh deploy
```

### Check network status

```bash
./start-kurtosis-pos.sh status
```

### View network logs

```bash
./start-kurtosis-pos.sh logs
```

### Stop the network

```bash
./start-kurtosis-pos.sh stop
```

### Clean up everything

```bash
./start-kurtosis-pos.sh cleanup
```

## Troubleshooting

### Network not responding

1. Check if Docker is running: `docker ps`
2. Check container logs: `./start-kurtosis-pos.sh logs`
3. Verify ports are not in use: `netstat -tlnp | grep -E ":(8545|4000)"`

### Deployment fails

1. Ensure Kurtosis network is running: `./deploy-to-kurtosis.sh check`
2. Check smart contract directory exists: `ls ../SmartContract/`
3. Verify Node.js dependencies: `cd ../SmartContract && npm install`

### Container stops unexpectedly

1. Check Docker logs: `docker logs kurtosis-pos-ethereum`
2. Verify system resources (memory, disk space)
3. Try restarting: `./start-kurtosis-pos.sh restart`

## Advanced Configuration

### Custom Network Parameters

Edit the `KURTOSIS_CONFIG` in `start-kurtosis-pos.sh` to modify:

- Network ID
- Number of participants
- Client types (geth, lighthouse, teku, etc.)
- Additional services (dora, blockscout, etc.)

### Custom Smart Contract Deployment

Edit `deploy-to-kurtosis.sh` to modify:

- Contract file path
- Deployment parameters
- Gas settings
- Private key (for testing only!)

## Security Notes

⚠️ **Important**: The deployment script uses a hardcoded private key for testing purposes only. Never use this in production!

For production deployments:
1. Use environment variables for private keys
2. Use proper key management solutions
3. Use testnet networks for development

## References

- [Kurtosis Documentation](https://docs.kurtosis.com/)
- [Ethereum PoS Guide](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/)
- [Geth Documentation](https://geth.ethereum.org/)
- [Lighthouse Documentation](https://lighthouse-book.sigmaprime.io/)

## Support

If you encounter issues:

1. Check the logs: `./start-kurtosis-pos.sh logs`
2. Verify Docker is running: `docker info`
3. Check system resources
4. Try restarting: `./start-kurtosis-pos.sh restart`
