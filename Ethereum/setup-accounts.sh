#!/bin/bash

# Setup Accounts for Ethereum Private Network
# This script creates accounts and funds them in the genesis block

set -e

# Add local bin to PATH for Geth
export PATH="$HOME/.local/bin:$PATH"

# Find Geth executable
find_geth() {
    if command -v geth &> /dev/null; then
        echo "geth"
    elif [ -f "$HOME/.local/bin/geth" ]; then
        echo "$HOME/.local/bin/geth"
    else
        echo -e "${RED}Geth not found. Please run setup first.${NC}"
        exit 1
    fi
}

GETH_CMD=$(find_geth)

# Configuration
NETWORK_DIR="./network"
ACCOUNTS_DIR="$NETWORK_DIR/accounts"
GENESIS_FILE="./genesis.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Ethereum accounts...${NC}"

# Create directories
mkdir -p "$ACCOUNTS_DIR"

# Function to create an account
create_account() {
    local account_name=$1
    local password_file="$ACCOUNTS_DIR/${account_name}.password"
    local key_file="$ACCOUNTS_DIR/${account_name}.key"
    
    echo -e "${YELLOW}Creating account: $account_name${NC}"
    
    # Create password file
    echo "password123" > "$password_file"
    
    # Create new account
    local address=$($GETH_CMD account new --datadir "$ACCOUNTS_DIR" --password "$password_file" 2>&1 | grep "Public address of the key:" | awk '{print $NF}')
    
    if [ -z "$address" ]; then
        echo -e "${RED}Failed to create account: $account_name${NC}"
        return 1
    fi
    
    echo -e "${GREEN}Account created: $address${NC}"
    echo "$address" > "$key_file"
    
    # Add to genesis alloc
    python3 -c "
import json
import sys

# Read current genesis
with open('$GENESIS_FILE', 'r') as f:
    genesis = json.load(f)

# Add new account with 1000 ETH
genesis['alloc']['$address'] = {'balance': '0x3635c9adc5dea00000'}

# Write back to genesis
with open('$GENESIS_FILE', 'w') as f:
    json.dump(genesis, f, indent=2)
"
    
    echo -e "${GREEN}Account $account_name added to genesis with 1000 ETH${NC}"
}

# Create accounts
create_account "validator1"
create_account "validator2"
create_account "user1"
create_account "user2"

# Create a script to unlock accounts
cat > "$ACCOUNTS_DIR/unlock-accounts.js" << 'EOF'
// Unlock accounts for mining/validation
personal.unlockAccount(eth.accounts[0], "password123", 0);
personal.unlockAccount(eth.accounts[1], "password123", 0);
personal.unlockAccount(eth.accounts[2], "password123", 0);
personal.unlockAccount(eth.accounts[3], "password123", 0);

console.log("Accounts unlocked:");
for (var i = 0; i < eth.accounts.length; i++) {
    console.log("Account " + i + ": " + eth.accounts[i] + " (Balance: " + web3.fromWei(eth.getBalance(eth.accounts[i]), "ether") + " ETH)");
}
EOF

# Create password file for all accounts
cat > "$ACCOUNTS_DIR/passwords.txt" << 'EOF'
password123
password123
password123
password123
EOF

echo -e "${GREEN}Account setup completed!${NC}"
echo -e "${BLUE}Accounts directory: $ACCOUNTS_DIR${NC}"
echo -e "${BLUE}Password file: $ACCOUNTS_DIR/passwords.txt${NC}"
echo -e "${BLUE}Unlock script: $ACCOUNTS_DIR/unlock-accounts.js${NC}"
