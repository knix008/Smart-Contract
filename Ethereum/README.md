# Ethereum Private Network with Kurtosis

A comprehensive Ethereum development environment using Kurtosis to create a private network with multiple Geth nodes, consensus clients, and dual block explorers.

## 🚀 Quick Start

### Prerequisites

- Linux (Ubuntu/Debian recommended)
- Docker
- Python 3.7+
- Git

### Installation

1. **Install dependencies and Kurtosis:**
   ```bash
   ./install-kurtosis.sh
   ```

2. **Start the network:**
   ```bash
   ./start-network.sh
   ```

3. **Check network status:**
   ```bash
   ./network-status.sh
   ```

4. **Test the network:**
   ```bash
   ./test-network.sh
   ```

## 📁 Project Structure

```
Ethereum/
├── SmartContract/
│   └── MyERC20Token.sol          # Your ERC20 token contract
├── network_params.yaml           # Kurtosis network configuration
├── kurtosis.yml                  # Kurtosis service definition
├── start-network.sh              # Start the network
├── stop-network.sh               # Stop the network
├── test-network.sh               # Test network functionality
├── network-status.sh             # Monitor network status
├── install-kurtosis.sh           # Install Kurtosis and dependencies
├── api-server.py                 # Flask API server
├── block-explorer.html           # Web-based block explorer
├── network-test.html             # Comprehensive test suite
└── README.md                     # This file
```

## 🔧 Configuration

### Network Parameters (`network_params.yaml`)

The network is configured with:
- **2 Geth + Lighthouse nodes**
- **1 Geth + Teku node**
- **Network ID**: 585858 (private)
- **Dora block explorer** (lightweight)
- **Blockscout block explorer** (full-featured)

### Customization

You can modify `network_params.yaml` to:
- Change the number of nodes
- Switch consensus clients (Lighthouse, Teku, Prysm)
- Modify network parameters
- Add additional services

## 🌐 Services

### 1. Network Management Scripts

- **`start-network.sh`**: Starts the Kurtosis network
- **`stop-network.sh`**: Stops all running enclaves
- **`test-network.sh`**: Tests network connectivity and functionality
- **`network-status.sh`**: Shows detailed network status

### 2. API Server (`api-server.py`)

A Flask-based API server providing:
- Network status monitoring
- RPC endpoint access
- Block and transaction queries
- Block explorer integration

**Start the API server:**
```bash
python3 api-server.py
```

**API Endpoints:**
- `GET /` - API information
- `GET /status` - Network status
- `GET /enclaves` - List running enclaves
- `GET /rpc/<method>` - Make RPC calls
- `GET /block/<number>` - Get block information
- `GET /transaction/<hash>` - Get transaction information
- `GET /explorer` - Get block explorer URL

### 3. Web Interfaces

#### Block Explorer (`block-explorer.html`)
- Real-time network monitoring
- Block and transaction search
- Network statistics
- Direct access to both Dora and Blockscout explorers

#### Network Test Suite (`network-test.html`)
- Comprehensive testing interface
- Basic connectivity tests
- Advanced network tests
- Performance benchmarks

### 4. Block Explorers

#### Dora Explorer
- **URL:** `http://127.0.0.1:32999`
- **Features:** Lightweight beacon chain explorer
- **Best for:** Quick blockchain overview and basic exploration

#### Blockscout Explorer
- **Frontend:** `http://127.0.0.1:3000`
- **API:** `http://127.0.0.1:33002`
- **Features:** Full-featured block explorer with transaction analysis, smart contract verification
- **Best for:** Advanced analytics, contract verification, detailed transaction tracking

## 🔍 Usage Examples

### 1. Basic Network Operations

```bash
# Start the network
./start-network.sh

# Check status
./network-status.sh

# Test functionality
./test-network.sh

# Stop the network
./stop-network.sh
```

### 2. API Usage

```bash
# Start API server
python3 api-server.py

# Test API (in another terminal)
curl http://localhost:5000/status
curl http://localhost:5000/rpc/eth_blockNumber
```

### 3. Web Interface

1. Open `block-explorer.html` in your browser
2. Open `network-test.html` for comprehensive testing
3. Access the block explorers:
   - **Dora:** `http://127.0.0.1:32999`
   - **Blockscout:** `http://127.0.0.1:3000`

### 4. Smart Contract Deployment

Your ERC20 token contract is ready for deployment:

```solidity
// MyERC20Token.sol
contract MyERC20Token is ERC20, ERC20Permit {
    constructor(address recipient)
        ERC20("MyERC20Token", "MTK")
        ERC20Permit("MyERC20Token")
    {
        _mint(recipient, 1000 * 10 ** decimals());
    }
}
```

## 🛠️ Development Workflow

### 1. Start Development Environment
```bash
./install-kurtosis.sh  # First time only
./start-network.sh
python3 api-server.py  # In another terminal
```

### 2. Access Services
- **Block Explorer**: Open `block-explorer.html`
- **Test Suite**: Open `network-test.html`
- **API Server**: http://localhost:5000
- **Dora Explorer**: http://127.0.0.1:32999
- **Blockscout Explorer**: http://127.0.0.1:3000

### 3. Deploy and Test Contracts
- Use the RPC endpoints for contract deployment
- Monitor transactions through the block explorer
- Test contract functionality

### 4. Monitor and Debug
- Use `network-status.sh` for real-time monitoring
- Check logs with `kurtosis service logs <enclave> <service>`
- Use the test suite for comprehensive testing

## 🔧 Troubleshooting

### Common Issues

1. **Docker not running**
   ```bash
   sudo systemctl start docker
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

2. **Kurtosis not found**
   ```bash
   ./install-kurtosis.sh
   source ~/.bashrc
   ```

3. **Network not starting**
   ```bash
   # Check Docker status
   docker info
   
   # Check Kurtosis logs
   kurtosis enclave ls
   ```

4. **API server not responding**
   ```bash
   # Install Python dependencies
   pip3 install flask flask-cors requests
   
   # Check if port 5000 is available
   netstat -tlnp | grep 5000
   ```

### Getting Help

- Check the [Kurtosis documentation](https://docs.kurtosis.com/)
- Review the [Geth documentation](https://geth.ethereum.org/docs/)
- Use the built-in test suite for diagnostics

## 🌐 Network Access Points

### RPC Endpoints
- **Node 1:** `http://127.0.0.1:32973`
- **Node 2:** `http://127.0.0.1:32978`
- **Node 3:** `http://127.0.0.1:32983`

### WebSocket Endpoints
- **Node 1:** `ws://127.0.0.1:32974`
- **Node 2:** `ws://127.0.0.1:32979`
- **Node 3:** `ws://127.0.0.1:32984`

### Block Explorers
- **Dora:** `http://127.0.0.1:32999`
- **Blockscout Frontend:** `http://127.0.0.1:3000`
- **Blockscout API:** `http://127.0.0.1:33002`

### Additional Services
- **Blockscout PostgreSQL:** `postgresql://127.0.0.1:33000`
- **Blockscout Verifier:** `http://127.0.0.1:33001`

## 📚 Additional Resources

- [Kurtosis Documentation](https://docs.kurtosis.com/)
- [Geth Documentation](https://geth.ethereum.org/docs/)
- [Ethereum Development](https://ethereum.org/developers/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Blockscout Documentation](https://docs.blockscout.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Ethereum Development! 🚀**
