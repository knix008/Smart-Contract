# Private Ethereum Network with Kurtosis

This project sets up a private Ethereum network using Kurtosis, featuring 3 Geth nodes and a custom web-based block explorer. It provides a complete local development environment for Ethereum applications.

## 🚀 Quick Start

### Prerequisites

- Docker installed and running
- Ubuntu/Debian system (for APT package manager)

### Installation

1. **Install Kurtosis CLI:**
   ```bash
   ./install-kurtosis.sh
   ```
   This script will:
   - Add the Kurtosis APT repository
   - Update package lists
   - Install the Kurtosis CLI
   - Verify the installation

2. **Start the Private Ethereum Network:**
   ```bash
   ./start-network.sh
   ```

3. **Start the Block Explorer:**
   ```bash
   ./add-explorers.sh
   ```

4. **Check Network Status:**
   ```bash
   ./network-status.sh
   ```

5. **Stop the Network:**
   ```bash
   ./stop-network.sh
   ```

## 📁 Project Structure

```
├── kurtosis.yml              # Kurtosis package configuration
├── main.star                 # Main Starlark script for network setup
├── network_params.yaml       # Network configuration parameters
├── block-explorer.html       # Custom web-based block explorer
├── install-kurtosis.sh       # Install Kurtosis CLI
├── start-network.sh          # Start the Ethereum network
├── add-explorers.sh          # Start the block explorer web server
├── stop-network.sh           # Stop the Ethereum network
├── network-status.sh         # Check network status
└── README.md                 # This file
```

## ⚙️ Network Configuration

The network is configured with the following parameters:

- **Network ID:** 3151908
- **Chain ID:** 3151908
- **Block Time:** ~12 seconds
- **Mining:** Enabled with pre-funded accounts
- **Node Type:** Geth (Proof of Work development mode)

## 🏗️ Architecture

The network consists of:

1. **3 Geth Nodes:** Running Ethereum client in development mode
2. **Custom Block Explorer:** Web-based interface on port 8080
3. **HTTP Server:** Python-based web server for the explorer

## 🔧 Manual Commands

If you prefer to run Kurtosis commands manually:

```bash
# Start the network
kurtosis run .

# List running enclaves
kurtosis enclave ls

# View logs
kurtosis enclave logs <enclave-name>

# Connect to a node
kurtosis enclave shell <enclave-name> <service-name>

# Stop the network
kurtosis enclave stop <enclave-name>
```

## 🌐 Network Access

Once the network is running, you can:

- **Block Explorer:** Web interface at `http://localhost:8080/block-explorer.html`
- **RPC Endpoints:** Connect to any of the 3 Geth nodes:
  - Node 1: `http://localhost:32801`
  - Node 2: `http://localhost:32803`
  - Node 3: `http://localhost:32805`
- **WebSocket:** Available on ports 32802, 32804, 32806
- Deploy smart contracts using Remix IDE or MetaMask
- Test Ethereum applications
- Use the network for development and testing

## 📚 Additional Resources

- [Kurtosis Documentation](https://docs.kurtosis.com/)
- [Geth Documentation](https://geth.ethereum.org/)
- [Remix IDE](https://remix.ethereum.org/) - For smart contract development
- [MetaMask](https://metamask.io/) - For wallet integration

## 🐛 Troubleshooting

1. **Docker not running:** Make sure Docker daemon is started
2. **Permission issues:** Ensure scripts are executable (`chmod +x *.sh`)
3. **Port conflicts:** Check if ports 8080, 32801-32806 are available
4. **Memory issues:** Ensure sufficient RAM (recommended 4GB+)
5. **Block explorer not loading:** Make sure to run `./add-explorers.sh` after starting the network
6. **Network not accessible:** Check if the Kurtosis enclave is running with `kurtosis enclave ls`

## 📝 Notes

- The network uses Geth development mode for fast startup
- All nodes are pre-funded and mining with 12-second block times
- The network is completely isolated and doesn't connect to mainnet or testnets
- The custom block explorer provides basic network monitoring and testing capabilities
- Port numbers may vary between network restarts (check `kurtosis enclave inspect` for current ports)
- The explorer connects to all 3 Geth nodes for redundancy
