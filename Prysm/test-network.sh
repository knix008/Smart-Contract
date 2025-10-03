#!/bin/bash

echo "========================================="
echo "Testing Private Ethereum PoS Network"
echo "========================================="
echo ""

# Test Geth
echo "1. Testing Geth Execution Client..."
echo "-----------------------------------"

# Check if geth is responding
echo -n "Geth RPC Status: "
response=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1}' \
  http://localhost:8545)

if [ $? -eq 0 ]; then
  echo "✓ Connected"
  echo "Client: $(echo $response | jq -r '.result')"
else
  echo "✗ Failed to connect"
fi

# Get chain ID
echo -n "Chain ID: "
chain_id=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://localhost:8545 | jq -r '.result')
echo "$((16#${chain_id:2}))"

# Get block number
echo -n "Current Block: "
block_num=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545 | jq -r '.result')
echo "$((16#${block_num:2}))"

# Get network peer count
echo -n "Connected Peers: "
peer_count=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}' \
  http://localhost:8545 | jq -r '.result')
echo "$((16#${peer_count:2}))"

# Check balance of pre-funded account
echo -n "Pre-funded Account Balance: "
balance=$(curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x123463a4b065722e99115d6c222f267d9cabb524","latest"],"id":1}' \
  http://localhost:8545 | jq -r '.result')
echo "$balance (hex)"

echo ""

# Test Prysm
echo "2. Testing Prysm Consensus Client..."
echo "-------------------------------------"

# Check node health
echo -n "Prysm Node Health: "
health=$(curl -s http://localhost:3500/eth/v1/node/health)
if [ $? -eq 0 ]; then
  echo "✓ Healthy"
else
  echo "✗ Unhealthy"
fi

# Get node version
echo -n "Node Version: "
version=$(curl -s http://localhost:3500/eth/v1/node/version | jq -r '.data.version')
echo "$version"

# Get sync status
echo -n "Sync Status: "
sync_status=$(curl -s http://localhost:3500/eth/v1/node/syncing | jq -r '.data.is_syncing')
if [ "$sync_status" == "false" ]; then
  echo "✓ Synced"
else
  echo "⚠ Syncing..."
fi

# Get genesis info
echo -n "Genesis Time: "
genesis=$(curl -s http://localhost:3500/eth/v1/beacon/genesis | jq -r '.data.genesis_time')
echo "$genesis ($(date -d @$genesis 2>/dev/null || date -r $genesis 2>/dev/null))"

# Get current head
echo -n "Head Slot: "
head_slot=$(curl -s http://localhost:3500/eth/v1/beacon/headers/head | jq -r '.data.header.message.slot')
echo "$head_slot"

echo -n "Head Block Root: "
head_root=$(curl -s http://localhost:3500/eth/v1/beacon/headers/head | jq -r '.data.root')
echo "$head_root"

# Get validator count
echo -n "Total Validators: "
validator_count=$(curl -s http://localhost:3500/eth/v1/beacon/states/head/validators | jq '.data | length')
echo "$validator_count"

echo ""

# Test Engine API connection
echo "3. Testing Engine API (EL-CL Connection)..."
echo "--------------------------------------------"

# Check if JWT authentication is working by checking recent logs
echo -n "Engine API Status: "
jwt_test=$(curl -s -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(cat jwt/jwt.hex)" \
  --data '{"jsonrpc":"2.0","method":"engine_exchangeCapabilities","params":[[]],"id":1}' \
  http://localhost:8551)

if echo "$jwt_test" | jq -e '.result' > /dev/null 2>&1; then
  echo "✓ Connected and authenticated"
  echo "Engine Capabilities: $(echo $jwt_test | jq -r '.result | join(", ")')"
else
  echo "⚠ Check logs for connection status"
fi

echo ""
echo "========================================="
echo "Network Test Complete"
echo "========================================="
echo ""
echo "Note: To produce blocks, you need to run validators."
echo "The network is currently waiting for validators to propose blocks."
