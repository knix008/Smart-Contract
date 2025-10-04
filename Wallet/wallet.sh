#!/bin/bash

# Ethereum Wallet CLI Launcher Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to script directory
cd "$SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install dependencies${NC}"
        exit 1
    fi
fi

# Check if wallet.js exists
if [ ! -f "wallet.js" ]; then
    echo -e "${RED}Error: wallet.js not found${NC}"
    exit 1
fi

# Check if wallet-cli.js exists
if [ ! -f "wallet-cli.js" ]; then
    echo -e "${RED}Error: wallet-cli.js not found${NC}"
    exit 1
fi

# Run the wallet CLI
echo -e "${GREEN}Starting Ethereum Wallet CLI...${NC}\n"
node wallet-cli.js

exit 0
