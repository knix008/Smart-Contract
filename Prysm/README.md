# Private Ethereum PoS Network

A single-node private Ethereum Proof-of-Stake network using Geth (execution layer) and Prysm (consensus layer).

## Prerequisites

- **geth** (go-ethereum) - Execution client
- **curl** - For downloading Prysm
- **jq** - For JSON processing and testing
- **openssl** - For JWT secret generation

## Quick Start

### 1. Setup and Initialize

```bash
# Generate genesis files and initialize
./restart-network.sh
```

This script will:
- Download Prysm if needed
- Generate JWT secret
- Create genesis files for both Geth and Prysm
- Initialize Geth with genesis
- Start all components (Geth, Beacon Chain, Validators)

### 2. Test the Network

```bash
./test-network.sh
```

## Network Configuration

### Network Details
- **Chain ID**: 32382
- **Network ID**: 32382
- **Consensus**: Proof of Stake (Capella/Shanghai fork)
- **Total Validators**: 64 (interop validators)
- **Slot Time**: 12 seconds
- **Epoch Length**: 32 slots

### RPC Endpoints
- **Geth HTTP RPC**: http://localhost:8545
- **Geth WebSocket**: ws://localhost:8546
- **Geth Engine API**: http://localhost:8551 (JWT authenticated)
- **Prysm gRPC**: http://localhost:4000
- **Prysm REST API**: http://localhost:3500
- **Prysm P2P**: tcp://localhost:13000
- **Geth P2P**: tcp://localhost:30303

### Pre-funded Accounts

**Account 1**: `0x123463a4b065722e99115d6c222f267d9cabb524`
- Balance: Very large (for testing)

**Account 2**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Balance: Very large (for testing)
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## File Structure

```
.
├── genesis.json          # Geth genesis configuration
├── genesis-clean.json    # Template genesis (without Cancun/Prague forks)
├── config.yml           # Prysm chain configuration
├── genesis.ssz          # Prysm genesis state (generated)
├── jwt/jwt.hex          # JWT secret for EL-CL auth
├── node1/               # Node data directory
│   ├── geth/           # Geth data
│   ├── consensus/      # Prysm beacon chain data
│   └── validator/      # Prysm validator data
├── smartcontracts/      # Smart contracts directory
│   ├── contracts/      # Solidity contracts
│   ├── scripts/        # Deployment scripts
│   └── hardhat.config.js
├── init.sh             # Initialize geth (standalone)
├── setup-prysm.sh      # Download Prysm
├── start-geth.sh       # Start geth execution client
├── start-prysm.sh      # Start Prysm beacon chain
├── start-validator.sh  # Start Prysm validators
├── restart-network.sh  # Complete network restart (recommended)
└── test-network.sh     # Test network connectivity
```

## Smart Contracts

### ERC-20 Token (MyToken)

Located in `smartcontracts/contracts/MyToken.sol`

Features:
- Standard ERC-20 functionality
- Burnable tokens
- Pausable transfers
- Minting capability (owner only)
- ERC-20 Permit (gasless approvals)

### Deploy Smart Contract

```bash
cd smartcontracts
npm install
npx hardhat compile

# Deploy (once network is producing blocks)
npx hardhat run scripts/deploy.js --network private
```

## Testing & Usage

### Check Network Status

```bash
# Check current block number
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545 | jq -r '.result' | xargs printf "%d\n"

# Check Prysm health
curl -s http://localhost:3500/eth/v1/node/health

# Check beacon chain head slot
curl -s http://localhost:3500/eth/v1/beacon/headers/head | jq -r '.data.header.message.slot'

# Check validator count
curl -s http://localhost:3500/eth/v1/beacon/states/head/validators | jq '.data | length'

# Check account balance
curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","latest"],"id":1}' \
  http://localhost:8545 | jq -r '.result'
```

### Connect with Web3

```javascript
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

// Check connection
web3.eth.getChainId().then(console.log); // 32382
web3.eth.getBlockNumber().then(console.log);
```

## Running Components Individually

### Start Geth Only
```bash
./start-geth.sh
```

### Start Beacon Chain Only
```bash
./start-prysm.sh
```

### Start Validators Only
```bash
./start-validator.sh
```

## Troubleshooting

### Network not producing blocks

**Known Issue**: Post-merge-from-genesis networks (PoS starting at block 0) have complex synchronization requirements between the execution and consensus layers.

**Current Status**:
- Geth is running with genesis block
- Prysm beacon chain is running
- 64 validators are running
- **Issue**: Genesis synchronization mismatch preventing block production

**Symptoms**:
- Block number stays at 0
- Beacon chain reports `"el_offline": true`
- Geth logs show: `"Fetching the unknown forkchoice head from network"`
- Validator logs show: `"payload status is SYNCING or ACCEPTED"`

**Workarounds**:
1. Use the `restart-network.sh` script which attempts to synchronize genesis properly
2. Check that `TERMINAL_BLOCK_HASH` in `config.yml` matches Geth's genesis hash
3. Ensure both clients use the same genesis timestamp

**Alternative Solutions**:
- Use Kurtosis or ethereum/hive for production PoS devnets
- Use Geth's `--dev` mode for quick smart contract testing
- Start with pre-merge (Altair) and transition to post-merge

### Connection issues
- Check if ports 8545, 8551, 4000, 3500, 13000, 30303 are available
- Verify JWT secret file exists at `jwt/jwt.hex`
- Check logs: `ps aux | grep -E "geth|prysm"`
- Verify Engine API: `curl http://localhost:8551` (should return auth error, not connection error)

### Reset network
```bash
# Complete reset
./restart-network.sh

# Or manual reset:
pkill -9 -f "geth|prysm"
rm -rf node1/
rm -f genesis.ssz
./init.sh
./start-geth.sh &
./start-prysm.sh &
./start-validator.sh &
```

### Validator issues
```bash
# Check validator status
curl -s http://localhost:3500/eth/v1/beacon/states/head/validators | jq '.data[] | select(.status == "active_ongoing") | .index' | wc -l

# Check validator logs
ps aux | grep validator
```

### JWT Authentication
```bash
# Verify JWT exists
cat jwt/jwt.hex

# Test Engine API (will fail without proper JWT)
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8551
```

## Configuration Details

### Genesis Configuration

**genesis-clean.json**: Template without Cancun/Prague forks (prevents blob schedule errors)

**genesis.json**: Active configuration used by Geth
- No Cancun/Prague forks (causes blob schedule issues)
- `terminalTotalDifficulty: 0` (PoS from genesis)
- `terminalTotalDifficultyPassed: true`

**config.yml**: Prysm chain configuration
- All forks active from epoch 0 (Capella/Shanghai)
- `TERMINAL_BLOCK_HASH`: Should match Geth's genesis hash
- `TERMINAL_TOTAL_DIFFICULTY: 0`

### Interop Validators

The network uses deterministic interop validators (test keys):
- 64 validators generated from deterministic seed
- Keys are derived using `--interop-num-validators=64 --interop-start-index=0`
- **Not for production use** - keys are publicly known

## Known Limitations

1. **Genesis Synchronization**: Post-merge-from-genesis setups are complex and may require manual intervention
2. **No Block Production**: Currently experiencing genesis sync issues preventing block production
3. **Interop Keys**: Using test validator keys (not secure for production)
4. **Single Node**: Network has no peers (isolated devnet)
5. **Fork Configuration**: Cancun and Prague forks disabled due to blob schedule requirements

## Development Workflow

### Smart Contract Deployment (once blocks are producing)

```bash
cd smartcontracts

# Compile
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.js --network private

# Interact
npx hardhat console --network private
```

### Custom Scripts

Create scripts in `smartcontracts/scripts/`:

```javascript
// example.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Account:", deployer.address);
  console.log("Balance:", await deployer.getBalance());
}

main();
```

Run with: `npx hardhat run scripts/example.js --network private`

## Additional Resources

- [Geth Documentation](https://geth.ethereum.org/docs)
- [Prysm Documentation](https://docs.prylabs.network)
- [Ethereum PoS Spec](https://github.com/ethereum/consensus-specs)
- [Engine API Spec](https://github.com/ethereum/execution-apis/tree/main/src/engine)

## Notes

- This is a **development/testing network** - not for production use
- The network uses PoS consensus with 64 interop validators
- All scripts should be run from the project root directory
- JWT authentication is required for Engine API communication
- Genesis synchronization between Geth and Prysm is a known challenge in post-merge-from-genesis setups
