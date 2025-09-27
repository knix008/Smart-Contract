# Ethereum PoS Private Network Setup

This project provides a complete setup for running a **Proof-of-Stake (PoS) Ethereum private network** using Geth (execution client) and Prysm (consensus client) for validation.

## Features

- **Complete PoS Private Network**: Fully isolated Ethereum PoS network with custom genesis block
- **3 Geth Execution Nodes**: Multiple execution clients for redundancy and load balancing
- **Prysm Consensus Client**: Complete beacon chain and validator for PoS consensus
- **Chain ID 1337**: Custom network identifier for private testing
- **Pre-funded Accounts**: Multiple accounts with initial ETH for testing
- **JWT Authentication**: Secure communication between execution and consensus layers
- **Easy Management**: Simple scripts to start, stop, and manage the network
- **Background Operation**: Run services in background for development
- **Comprehensive Logging**: Detailed logs for debugging and monitoring

## Prerequisites

Before running the network, ensure you have the following installed:

### Required Software

1. **Geth (Go Ethereum)**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install software-properties-common
   sudo add-apt-repository -y ppa:ethereum/ethereum
   sudo apt-get update
   sudo apt-get install ethereum

   # Or build from source
   git clone https://github.com/ethereum/go-ethereum.git
   cd go-ethereum
   make geth
   ```

2. **OpenSSL**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install openssl

   # macOS
   brew install openssl
   ```

3. **Python 3**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install python3

   # macOS
   brew install python3
   ```

4. **Prysm (will be downloaded automatically)**
   - The setup script will download Prysm during the first run

### System Requirements

- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 10GB free space
- **CPU**: Multi-core processor recommended
- **Network**: No special network requirements (private network)

## Quick Start

1. **Clone or download the project files**
   ```bash
   # Ensure all scripts are executable
   chmod +x *.sh
   ```
   
   **Note**: All scripts automatically include the necessary PATH configuration for Geth, so no manual PATH setup is required.

2. **Setup the PoS network (first time only)**
   ```bash
   ./manage-network.sh setup
   ```
   This will:
   - Download and install Geth 1.16.4
   - Create pre-funded accounts
   - Generate JWT secret for execution-consensus communication
   - Create Prysm validator wallet

3. **Start the PoS network**
   ```bash
   ./manage-network.sh start
   ```
   This will start:
   - 3 Geth execution nodes (Chain ID: 1337)
   - Prysm beacon chain (consensus layer)
   - Prysm validator (for block validation)

4. **Check network status**
   ```bash
   ./manage-network.sh status
   ```

5. **Stop the network**
   ```bash
   ./manage-network.sh stop
   ```

## File Structure

```
Ethereum/
├── genesis.json              # Genesis block configuration
├── setup-accounts.sh         # Account creation and funding script
├── start-geth.sh            # Geth execution client management
├── start-prysm.sh           # Prysm consensus client management
├── manage-network.sh        # Main network management script
├── README.md                # This documentation
└── network/                 # Network data directory (created during setup)
    ├── accounts/            # Account keystores and passwords
    ├── geth/               # Geth data directory
    ├── prysm/              # Prysm data directory
    ├── geth.log            # Geth execution logs
    ├── beacon.log          # Prysm beacon chain logs
    ├── validator.log       # Prysm validator logs
    └── jwt.hex             # JWT secret for client communication
```

## Network Configuration

### Network Parameters

- **Network ID**: 1337
- **Chain ID**: 1337
- **Consensus**: Proof-of-Stake (PoS) with Prysm
- **Execution Layer**: Geth 1.16.4 (3 nodes)
- **Consensus Layer**: Prysm v6.1.0 (beacon chain + validator)
- **Genesis Configuration**: Custom PoS genesis with terminal total difficulty
- **JWT Authentication**: Enabled between execution and consensus clients

### Port Configuration

| Service | Port | Description |
|---------|------|-------------|
| **Node 1** | | |
| Node 1 HTTP RPC | 8545 | JSON-RPC API endpoint |
| Node 1 WebSocket | 8546 | WebSocket API endpoint |
| Node 1 Auth RPC | 8551 | Authentication endpoint |
| Node 1 P2P | 30303 | Peer-to-peer networking |
| **Node 2** | | |
| Node 2 HTTP RPC | 8547 | JSON-RPC API endpoint |
| Node 2 WebSocket | 8548 | WebSocket API endpoint |
| Node 2 Auth RPC | 8552 | Authentication endpoint |
| Node 2 P2P | 30304 | Peer-to-peer networking |
| **Node 3** | | |
| Node 3 HTTP RPC | 8549 | JSON-RPC API endpoint |
| Node 3 WebSocket | 8550 | WebSocket API endpoint |
| Node 3 Auth RPC | 8553 | Authentication endpoint |
| Node 3 P2P | 30305 | Peer-to-peer networking |
| **Prysm** | | |
| Prysm Beacon RPC | 4000 | Beacon chain RPC |
| Prysm Beacon gRPC | 4001 | Beacon chain gRPC |
| Prysm Validator gRPC | 4002 | Validator gRPC |
| Prysm Beacon P2P | 13001 | Beacon chain peer-to-peer |

### Pre-funded Accounts

The setup creates 4 accounts with 1000 ETH each:

1. **Validator 1**: Primary validator account
2. **Validator 2**: Secondary validator account  
3. **User 1**: General user account
4. **User 2**: General user account

All accounts use password: `password123`

## Usage Examples

### Basic Network Management

```bash
# Setup network (first time)
./manage-network.sh setup

# Start network
./manage-network.sh start

# Check status
./manage-network.sh status

# View logs
./manage-network.sh logs

# Stop network
./manage-network.sh stop
```

### Individual Service Management

```bash
# Start only multiple Geth nodes (PoS mode)
./start-multi-geth.sh start

# Start only single Geth node (fallback)
./start-geth.sh background

# Start only Prysm consensus layer (beacon + validator)
./start-prysm.sh start

# Check multi-node Geth status
./start-multi-geth.sh status

# Check single Geth status
./start-geth.sh status

# Check Prysm consensus status
./start-prysm.sh status
```

### Log Monitoring

```bash
# View all logs
./manage-network.sh logs

# View specific service logs
./manage-network.sh logs node1
./manage-network.sh logs node2
./manage-network.sh logs node3
./manage-network.sh logs geth
./manage-network.sh logs beacon
./manage-network.sh logs validator
```

### Network Cleanup

```bash
# Clean all network data (removes all accounts and blockchain data)
./manage-network.sh clean
```

## Connecting to the Network

### Using Web3 Libraries

```javascript
// Connect to any of the 3 PoS execution nodes
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545'); // Node 1
// const web3 = new Web3('http://localhost:8547'); // Node 2
// const web3 = new Web3('http://localhost:8549'); // Node 3

// Check network ID (PoS network)
web3.eth.net.getId().then(console.log); // Should return 1337

// Check if network is synced (PoS specific)
web3.eth.isSyncing().then(console.log);

// Get account balance
web3.eth.getBalance('0x75ec983bc0bD7d8Cbc4785556D8888E376336586')
  .then(balance => console.log(web3.utils.fromWei(balance, 'ether')));

// Get latest block (PoS blocks)
web3.eth.getBlock('latest').then(console.log);
```

### Using MetaMask

1. Open MetaMask
2. Click on network dropdown
3. Select "Add Network"
4. Enter network details:
   - **Network Name**: Ethereum PoS Private (Node 1)
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
5. You can add multiple networks for each execution node:
   - Node 1: http://localhost:8545
   - Node 2: http://localhost:8547
   - Node 3: http://localhost:8549
6. Import accounts using the private keys from the network/accounts directory
7. **Note**: This is a PoS network, so blocks are produced by validators, not miners

### Using Remix IDE

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Go to Deploy & Run tab
3. Select "Web3 Provider" as environment
4. Enter RPC URL: http://localhost:8545
5. Deploy and interact with contracts

## Development Workflow

### Smart Contract Development

1. **Start the network**
   ```bash
   ./manage-network.sh start
   ```

2. **Deploy contracts** using Remix, Hardhat, or Truffle

3. **Interact with contracts** using the funded accounts

4. **Monitor transactions** in the logs

### Testing

- Use the pre-funded accounts for testing transactions
- Each account has 1000 ETH for testing
- Network processes transactions immediately (no waiting for block confirmation)

### Debugging

- Check logs for detailed information: `./manage-network.sh logs`
- Use Geth console for direct interaction: `geth attach http://localhost:8545`
- Monitor network status: `./manage-network.sh status`

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :8545
   
   # Kill the process or change port in scripts
   ```

2. **Permission denied**
   ```bash
   # Make scripts executable
   chmod +x *.sh
   ```

3. **Geth fails to start**
   ```bash
   # Check if genesis.json is valid
   cat genesis.json | python3 -m json.tool
   
   # Clean and restart
   ./manage-network.sh clean
   ./manage-network.sh setup
   ```

4. **Prysm fails to start**
   ```bash
   # Check if JWT secret exists
   ls -la network/jwt.hex
   
   # Regenerate JWT secret
   openssl rand -hex 32 | tr -d "\n" > network/jwt.hex
   ```

5. **Accounts not funded**
   ```bash
   # Re-run account setup
   ./setup-accounts.sh
   ```

### Log Analysis

- **Geth logs**: `tail -f network/geth.log`
- **Prysm logs**: `tail -f network/beacon.log network/validator.log`
- **Error patterns**: Look for "ERROR", "FATAL", or "panic" in logs

### Performance Optimization

- **Increase mining threads**: Edit `start-geth.sh` and change `--miner.threads`
- **Adjust verbosity**: Change `--verbosity` level in scripts
- **Memory optimization**: Monitor system resources during operation

## Security Considerations

⚠️ **Important Security Notes:**

1. **Private Keys**: Never use the default accounts in production
2. **Network Isolation**: This is a private network - not connected to mainnet
3. **Passwords**: Default password is `password123` - change for production
4. **Firewall**: Consider firewall rules if running on public servers
5. **Backup**: Always backup your keystore files

## Advanced Configuration

### Custom Genesis Block

Edit `genesis.json` to modify:
- Initial account balances
- Network parameters
- Fork configurations
- Block gas limits

### Custom Network Parameters

Modify the scripts to change:
- Network ID and Chain ID
- Port configurations
- Account passwords
- Mining parameters

### Multiple Validators

To add more validators:
1. Create additional accounts
2. Modify genesis block
3. Update validator configuration
4. Start additional validator instances

## PoS Network Features

### Consensus Mechanism

This private network uses **Proof-of-Stake (PoS)** consensus:
- **Execution Layer**: Geth nodes handle transaction execution and state management
- **Consensus Layer**: Prysm beacon chain and validator provide PoS consensus
- **Block Production**: Validators propose and attest to blocks instead of mining
- **Finality**: Blocks achieve finality through the beacon chain consensus

### Network Synchronization

- **Execution-Consensus Sync**: Geth and Prysm communicate via JWT-authenticated RPC
- **Beacon Chain Sync**: Prysm beacon chain syncs with the execution layer
- **Validator Participation**: Validator participates in consensus and block production

### PoS-Specific Monitoring

```bash
# Check beacon chain status
./start-prysm.sh status

# Monitor beacon chain logs
tail -f ./network/beacon.log

# Monitor validator logs
tail -f ./network/validator.log

# Check execution layer sync
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \
  http://localhost:8545
```

### Troubleshooting PoS Issues

**Beacon Chain Not Starting:**
- Check if JWT secret file exists: `./network/jwt.hex`
- Verify execution endpoint is accessible: `http://localhost:8551`
- Check chain ID compatibility (should be 1337)

**Validator Not Running:**
- Ensure validator wallet is created: `./network/prysm/validator/wallet`
- Check wallet password file: `./network/validator_password.txt`
- Verify beacon chain is running before starting validator

**Network Sync Issues:**
- Check if all Geth nodes are running: `./start-multi-geth.sh status`
- Verify JWT authentication between execution and consensus layers
- Monitor logs for connection errors

## Support and Contributing

### Getting Help

- Check the logs first: `./manage-network.sh logs`
- Review this documentation
- Check Ethereum and Prysm documentation

### Contributing

- Fork the repository
- Create feature branches
- Test thoroughly
- Submit pull requests

## License

This project is provided as-is for educational and development purposes. Use at your own risk.

## Acknowledgments

- [Geth Documentation](https://geth.ethereum.org/docs/)
- [Prysm Documentation](https://docs.prylabs.network/)
- [Ethereum Foundation](https://ethereum.org/)
