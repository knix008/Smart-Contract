#!/bin/bash

set -e

echo "======================================"
echo "Smart Contract Deploy & Test Script"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the SmartContract directory
if [ ! -f "hardhat.config.js" ]; then
    echo -e "${RED}Error: Please run this script from the SmartContract directory${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}node_modules not found. Installing dependencies...${NC}"
    npm install --legacy-peer-deps
fi

# Clean previous builds
echo -e "\n${YELLOW}[1/5] Cleaning previous builds...${NC}"
if [ -d "artifacts" ]; then
    rm -rf artifacts cache
    echo "Cleaned artifacts and cache"
fi

# Compile contracts
echo -e "\n${YELLOW}[2/5] Compiling smart contracts...${NC}"
npx hardhat compile

if [ $? -ne 0 ]; then
    echo -e "${RED}Compilation failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Compilation successful${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}.env file not found. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "Created .env file. Please update it with your configuration."
    else
        echo -e "${RED}Error: .env.example not found${NC}"
        exit 1
    fi
fi

# Check if network is accessible
echo -e "\n${YELLOW}[3/5] Checking network connectivity...${NC}"

# Get the RPC URL from .env file
RPC_URL=$(grep -oP '^RPC_URL=\K.*' .env)

if [ -z "$RPC_URL" ]; then
    echo -e "${RED}Could not find RPC_URL in .env file${NC}"
    exit 1
fi

echo "Testing connection to: $RPC_URL"

# Test network connectivity
if ! curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    "$RPC_URL" > /dev/null; then
    echo -e "${RED}Error: Cannot connect to Ethereum network at $RPC_URL${NC}"
    echo -e "${YELLOW}Make sure the network is running (../start_network.sh)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Network is accessible${NC}"

# Deploy contract
echo -e "\n${YELLOW}[4/5] Deploying smart contract...${NC}"
echo "======================================"

DEPLOY_OUTPUT=$(node scripts/deploy.js 2>&1)
DEPLOY_EXIT_CODE=$?

echo "$DEPLOY_OUTPUT"

if [ $DEPLOY_EXIT_CODE -ne 0 ]; then
    echo -e "\n${RED}✗ Deployment failed!${NC}"
    exit 1
fi

# Extract contract address from deployment output
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'MyToken deployed to: \K0x[a-fA-F0-9]{40}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "\n${RED}✗ Could not extract contract address from deployment${NC}"
    exit 1
fi

echo -e "\n${GREEN}✓ Contract deployed successfully${NC}"
echo -e "${GREEN}Contract Address: $CONTRACT_ADDRESS${NC}"

# Save contract address for future reference
echo "$CONTRACT_ADDRESS" > .contract_address
echo "Contract address saved to .contract_address and .env file"

# Test contract interactions
echo -e "\n${YELLOW}[5/5] Testing contract interactions...${NC}"
echo "======================================"

TEST_OUTPUT=$(node scripts/interact.js 2>&1)
TEST_EXIT_CODE=$?

echo "$TEST_OUTPUT"

if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo -e "\n${RED}✗ Contract tests failed!${NC}"
    exit 1
fi

echo -e "\n${GREEN}✓ All tests passed successfully!${NC}"

# Summary
echo -e "\n======================================"
echo -e "${GREEN}Deployment & Testing Complete!${NC}"
echo -e "======================================"
echo ""
echo "Contract Address: $CONTRACT_ADDRESS"
echo "Network: $RPC_URL"
echo ""
echo "You can interact with the contract using:"
echo "  node scripts/interact.js"
echo ""
echo "Or view the contract address from:"
echo "  cat .contract_address"
