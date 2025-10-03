#!/bin/bash

set -e

echo "======================================"
echo "Smart Contract Interaction Test"
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

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo -e "${YELLOW}Please create .env file from .env.example:${NC}"
    echo "  cp .env.example .env"
    exit 1
fi

# Check if CONTRACT_ADDRESS is set in .env
CONTRACT_ADDRESS=$(grep -oP '^CONTRACT_ADDRESS=\K.*' .env)

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo -e "${RED}Error: CONTRACT_ADDRESS not set in .env file${NC}"
    echo -e "${YELLOW}Please deploy the contract first:${NC}"
    echo "  node scripts/deploy.js"
    exit 1
fi

# Get the RPC URL from .env file
RPC_URL=$(grep -oP '^RPC_URL=\K.*' .env)

if [ -z "$RPC_URL" ]; then
    echo -e "${RED}Could not find RPC_URL in .env file${NC}"
    exit 1
fi

# Check if network is accessible
echo -e "\n${YELLOW}Checking network connectivity...${NC}"
echo "Testing connection to: $RPC_URL"

if ! curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    "$RPC_URL" > /dev/null; then
    echo -e "${RED}Error: Cannot connect to Ethereum network at $RPC_URL${NC}"
    echo -e "${YELLOW}Make sure the network is running (../start_network.sh)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Network is accessible${NC}"

# Run interaction tests
echo -e "\n${YELLOW}Running contract interaction tests...${NC}"
echo "Contract Address: $CONTRACT_ADDRESS"
echo "======================================"
echo ""

TEST_OUTPUT=$(node scripts/interact.js 2>&1)
TEST_EXIT_CODE=$?

echo "$TEST_OUTPUT"

if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo -e "\n${RED}✗ Contract tests failed!${NC}"
    exit 1
fi

echo -e "\n${GREEN}✓ All tests passed successfully!${NC}"
echo -e "\n======================================"
echo -e "${GREEN}Testing Complete!${NC}"
echo -e "======================================"
