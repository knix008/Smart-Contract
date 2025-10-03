#!/bin/bash

echo "========================================="
echo "Restarting Private Ethereum PoS Network"
echo "========================================="

# Stop all processes
echo "1. Stopping all processes..."
pkill -f "geth.*node1" 2>/dev/null
pkill -f "beacon-chain.*node1" 2>/dev/null
pkill -f "validator.*node1" 2>/dev/null
sleep 3

# Clean all data
echo "2. Cleaning all data..."
rm -rf node1/
rm -f genesis.ssz

# Generate temporary genesis to get fork times
echo "3. Generating temporary genesis..."
./prysmctl testnet generate-genesis \
  --fork=capella \
  --num-validators=64 \
  --genesis-time-delay=30 \
  --chain-config-file=config.yml \
  --geth-genesis-json-in=genesis-clean.json \
  --geth-genesis-json-out=genesis-temp.json \
  --output-ssz=genesis-temp.ssz > /dev/null 2>&1

# Remove Cancun/Prague forks and create final genesis.json
echo "4. Fixing genesis.json..."
cat genesis-temp.json | jq 'del(.config.cancunTime, .config.pragueTime) | .config.terminalTotalDifficultyPassed = true' > genesis.json
rm genesis-temp.json genesis-temp.ssz

# Initialize geth with fixed genesis
echo "5. Initializing geth..."
mkdir -p node1/geth
geth init --datadir=node1/geth genesis.json

# Start geth and wait for it to be ready
echo "6. Starting geth..."
./start-geth.sh > /dev/null 2>&1 &
GETH_PID=$!
echo "Waiting for geth to be ready..."
sleep 8

# Generate genesis.ssz with correct execution block hash from running geth
echo "7. Generating genesis.ssz with correct execution block hash..."
./prysmctl testnet generate-genesis \
  --fork=capella \
  --num-validators=64 \
  --genesis-time-delay=30 \
  --chain-config-file=config.yml \
  --geth-genesis-json-in=genesis.json \
  --geth-genesis-json-out=genesis-verify.json \
  --output-ssz=genesis.ssz \
  --execution-endpoint=http://localhost:8545 \
  --override-eth1data=true
rm -f genesis-verify.json

# Start Prysm beacon chain in background
echo "8. Starting Prysm beacon chain..."
./start-prysm.sh > /dev/null 2>&1 &
BEACON_PID=$!
sleep 10

# Start validators in background
echo "9. Starting validators..."
./start-validator.sh > /dev/null 2>&1 &
VALIDATOR_PID=$!

echo ""
echo "========================================="
echo "Network started successfully!"
echo "========================================="
echo "Geth PID: $GETH_PID"
echo "Beacon PID: $BEACON_PID"
echo "Validator PID: $VALIDATOR_PID"
echo ""
echo "Waiting 30 seconds for genesis time..."
sleep 30

echo ""
echo "Checking network status..."
./test-network.sh
