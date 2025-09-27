#!/bin/bash

# Start Geth Execution Client for Ethereum Private Network
# This script starts Geth with proper configuration for private network

set -e

# Add local bin to PATH for Geth
export PATH="$HOME/.local/bin:$PATH"

# Configuration
NETWORK_DIR="./network"
GETH_DIR="$NETWORK_DIR/geth"
ACCOUNTS_DIR="$NETWORK_DIR/accounts"
GENESIS_FILE="./genesis.json"
JWT_SECRET_FILE="$NETWORK_DIR/jwt.hex"
PASSWORD_FILE="$ACCOUNTS_DIR/passwords.txt"
UNLOCK_SCRIPT="$ACCOUNTS_DIR/unlock-accounts.js"

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

# Network configuration
NETWORK_ID=1337
HTTP_PORT=8545
WS_PORT=8546
AUTH_RPC_PORT=8551
P2P_PORT=30303

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Geth Execution Client...${NC}"

# Create directories
mkdir -p "$GETH_DIR"

# Generate JWT secret if it doesn't exist
if [ ! -f "$JWT_SECRET_FILE" ]; then
    echo -e "${YELLOW}Generating JWT secret...${NC}"
    openssl rand -hex 32 | tr -d "\n" > "$JWT_SECRET_FILE"
    echo -e "${GREEN}JWT secret generated: $JWT_SECRET_FILE${NC}"
fi

# Initialize Geth with genesis if not already initialized
if [ ! -d "$GETH_DIR/geth" ]; then
    echo -e "${YELLOW}Initializing Geth with genesis block...${NC}"
    $GETH_CMD init --datadir "$GETH_DIR" "$GENESIS_FILE"
    echo -e "${GREEN}Geth initialized with genesis block${NC}"
fi

# Import accounts if they exist
if [ -d "$ACCOUNTS_DIR" ]; then
    echo -e "${YELLOW}Importing accounts...${NC}"
    for key_file in "$ACCOUNTS_DIR"/*.key; do
        if [ -f "$key_file" ]; then
            address=$(cat "$key_file")
            echo -e "${BLUE}Importing account: $address${NC}"
            # Note: In a real scenario, you'd import the actual keystore files
            # For this script, we assume accounts are already in the keystore
        fi
    done
fi

# Function to start Geth
start_geth() {
    echo -e "${YELLOW}Starting Geth node...${NC}"
    echo -e "${BLUE}Network ID: $NETWORK_ID${NC}"
    echo -e "${BLUE}HTTP RPC: http://localhost:$HTTP_PORT${NC}"
    echo -e "${BLUE}WebSocket RPC: ws://localhost:$WS_PORT${NC}"
    echo -e "${BLUE}Auth RPC: http://localhost:$AUTH_RPC_PORT${NC}"
    echo -e "${BLUE}P2P Port: $P2P_PORT${NC}"
    
    # Start Geth with proper configuration
    $GETH_CMD \
        --datadir "$GETH_DIR" \
        --networkid "$NETWORK_ID" \
        --http \
        --http.addr "0.0.0.0" \
        --http.port "$HTTP_PORT" \
        --http.api "eth,net,web3,personal,miner,admin,txpool,debug" \
        --http.corsdomain "*" \
        --ws \
        --ws.addr "0.0.0.0" \
        --ws.port "$WS_PORT" \
        --ws.api "eth,net,web3,personal,miner,admin,txpool,debug" \
        --ws.origins "*" \
        --authrpc.addr "127.0.0.1" \
        --authrpc.port "$AUTH_RPC_PORT" \
        --authrpc.jwtsecret "$JWT_SECRET_FILE" \
        --port "$P2P_PORT" \
        --nodiscover \
        --maxpeers 0 \
        --allow-insecure-unlock \
        --unlock "0,1,2,3" \
        --password "$PASSWORD_FILE" \
        --mine \
        --miner.etherbase "0" \
        --syncmode full \
        --verbosity 3
}

# Function to start Geth in background
start_geth_background() {
    echo -e "${YELLOW}Starting Geth node in background...${NC}"
    nohup $GETH_CMD \
        --datadir "$GETH_DIR" \
        --networkid "$NETWORK_ID" \
        --http \
        --http.addr "0.0.0.0" \
        --http.port "$HTTP_PORT" \
        --http.api "eth,net,web3,personal,miner,admin,txpool,debug" \
        --http.corsdomain "*" \
        --ws \
        --ws.addr "0.0.0.0" \
        --ws.port "$WS_PORT" \
        --ws.api "eth,net,web3,personal,miner,admin,txpool,debug" \
        --ws.origins "*" \
        --authrpc.addr "127.0.0.1" \
        --authrpc.port "$AUTH_RPC_PORT" \
        --authrpc.jwtsecret "$JWT_SECRET_FILE" \
        --port "$P2P_PORT" \
        --nodiscover \
        --maxpeers 0 \
        --allow-insecure-unlock \
        --unlock "0,1,2,3" \
        --password "$PASSWORD_FILE" \
        --mine \
        --miner.etherbase "0" \
        --syncmode full \
        --verbosity 3 \
        > "$NETWORK_DIR/geth.log" 2>&1 &
    
    GETH_PID=$!
    echo $GETH_PID > "$NETWORK_DIR/geth.pid"
    echo -e "${GREEN}Geth started in background with PID: $GETH_PID${NC}"
    echo -e "${BLUE}Log file: $NETWORK_DIR/geth.log${NC}"
}

# Function to stop Geth
stop_geth() {
    if [ -f "$NETWORK_DIR/geth.pid" ]; then
        PID=$(cat "$NETWORK_DIR/geth.pid")
        if ps -p $PID > /dev/null; then
            echo -e "${YELLOW}Stopping Geth (PID: $PID)...${NC}"
            kill $PID
            rm "$NETWORK_DIR/geth.pid"
            echo -e "${GREEN}Geth stopped${NC}"
        else
            echo -e "${RED}Geth process not found${NC}"
            rm "$NETWORK_DIR/geth.pid"
        fi
    else
        echo -e "${RED}No Geth PID file found${NC}"
    fi
}

# Function to check Geth status
check_geth_status() {
    if [ -f "$NETWORK_DIR/geth.pid" ]; then
        PID=$(cat "$NETWORK_DIR/geth.pid")
        if ps -p $PID > /dev/null; then
            echo -e "${GREEN}Geth is running (PID: $PID)${NC}"
            return 0
        else
            echo -e "${RED}Geth is not running${NC}"
            rm "$NETWORK_DIR/geth.pid"
            return 1
        fi
    else
        echo -e "${RED}Geth is not running${NC}"
        return 1
    fi
}

# Main script logic
case "${1:-start}" in
    "start")
        start_geth
        ;;
    "background"|"bg")
        start_geth_background
        ;;
    "stop")
        stop_geth
        ;;
    "status")
        check_geth_status
        ;;
    "restart")
        stop_geth
        sleep 2
        start_geth_background
        ;;
    *)
        echo -e "${BLUE}Usage: $0 [start|background|stop|status|restart]${NC}"
        echo -e "${YELLOW}  start    - Start Geth in foreground${NC}"
        echo -e "${YELLOW}  background - Start Geth in background${NC}"
        echo -e "${YELLOW}  stop     - Stop Geth${NC}"
        echo -e "${YELLOW}  status   - Check Geth status${NC}"
        echo -e "${YELLOW}  restart  - Restart Geth${NC}"
        exit 1
        ;;
esac
