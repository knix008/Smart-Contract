#!/bin/bash

# Start Prysm Beacon Chain and Validator for Ethereum Private Network
# This script starts Prysm consensus client with proper configuration

set -e

# Add local bin to PATH for Geth
export PATH="$HOME/.local/bin:$PATH"

# Configuration
NETWORK_DIR="./network"
PRYSM_DIR="$NETWORK_DIR/prysm"
BEACON_DIR="$PRYSM_DIR/beacon"
VALIDATOR_DIR="$PRYSM_DIR/validator"
JWT_SECRET_FILE="$NETWORK_DIR/jwt.hex"

# Network configuration
NETWORK_ID=1337
BEACON_RPC_PORT=4000
BEACON_GRPC_PORT=4001
VALIDATOR_GRPC_PORT=4002
BEACON_P2P_PORT=13001
EXECUTION_ENDPOINT="http://127.0.0.1:8551"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Prysm Consensus Client...${NC}"

# Create directories
mkdir -p "$BEACON_DIR" "$VALIDATOR_DIR"

# Check if JWT secret exists
if [ ! -f "$JWT_SECRET_FILE" ]; then
    echo -e "${RED}JWT secret file not found: $JWT_SECRET_FILE${NC}"
    echo -e "${YELLOW}Please run start-geth.sh first to generate JWT secret${NC}"
    exit 1
fi

# Check if Prysm is installed
check_prysm() {
    # First check if prysm.sh script exists
    if [ -f "./prysm.sh" ]; then
        echo -e "${GREEN}Prysm installation script found${NC}"
        return 0
    fi
    
    # Then check if prysm command is available
    if command -v prysm &> /dev/null; then
        echo -e "${GREEN}Prysm found in PATH${NC}"
        return 0
    fi
    
    # If neither exists, download the script
    echo -e "${YELLOW}Prysm not found. Installing Prysm...${NC}"
    install_prysm
}

# Install Prysm
install_prysm() {
    echo -e "${YELLOW}Downloading Prysm installation script...${NC}"
    curl https://raw.githubusercontent.com/prysmaticlabs/prysm/master/prysm.sh --output prysm.sh
    chmod +x prysm.sh
    echo -e "${GREEN}Prysm installation script downloaded${NC}"
}

# Generate genesis state for Prysm
generate_genesis_state() {
    if [ ! -f "$BEACON_DIR/genesis.ssz" ]; then
        echo -e "${YELLOW}Generating genesis state for Prysm...${NC}"
        
        # Create a simple genesis state file (this is a placeholder)
        # In a real scenario, you would use eth2-testnet-genesis or similar tools
        echo -e "${BLUE}Note: For a real private network, you need to generate proper genesis.ssz${NC}"
        echo -e "${BLUE}This requires eth2-testnet-genesis tool or similar${NC}"
        
        # Create a dummy genesis file for demonstration
        touch "$BEACON_DIR/genesis.ssz"
        echo -e "${GREEN}Genesis state file created (placeholder)${NC}"
    fi
}

# Start Beacon Chain
start_beacon_chain() {
    echo -e "${YELLOW}Starting Prysm Beacon Chain...${NC}"
    echo -e "${BLUE}Beacon RPC: http://localhost:$BEACON_RPC_PORT${NC}"
    echo -e "${BLUE}Beacon gRPC: http://localhost:$BEACON_GRPC_PORT${NC}"
    echo -e "${BLUE}Beacon P2P: $BEACON_P2P_PORT${NC}"
    
    # Use prysm.sh script if available, otherwise use direct command
    if [ -f "./prysm.sh" ]; then
        ./prysm.sh beacon-chain \
            --datadir="$BEACON_DIR" \
            --execution-endpoint="$EXECUTION_ENDPOINT" \
            --jwt-secret="$JWT_SECRET_FILE" \
            --chain-id="$NETWORK_ID" \
            --rpc-host="127.0.0.1" \
            --rpc-port="$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$BEACON_GRPC_PORT" \
            --p2p-tcp-port="$BEACON_P2P_PORT" \
            --p2p-udp-port="$BEACON_P2P_PORT" \
            --genesis-state="$BEACON_DIR/genesis.ssz" \
            --accept-terms-of-use \
    else
        prysm beacon-chain \
            --datadir="$BEACON_DIR" \
            --execution-endpoint="$EXECUTION_ENDPOINT" \
            --jwt-secret="$JWT_SECRET_FILE" \
            --chain-id="$NETWORK_ID" \
            --rpc-host="127.0.0.1" \
            --rpc-port="$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$BEACON_GRPC_PORT" \
            --p2p-tcp-port="$BEACON_P2P_PORT" \
            --p2p-udp-port="$BEACON_P2P_PORT" \
            --genesis-state="$BEACON_DIR/genesis.ssz" \
            --accept-terms-of-use
    else
        prysm beacon-chain \
            --datadir="$BEACON_DIR" \
            --execution-endpoint="$EXECUTION_ENDPOINT" \
            --jwt-secret="$JWT_SECRET_FILE" \
            --chain-id="$NETWORK_ID" \
            --rpc-host="127.0.0.1" \
            --rpc-port="$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$BEACON_GRPC_PORT" \
            --p2p-tcp-port="$BEACON_P2P_PORT" \
            --p2p-udp-port="$BEACON_P2P_PORT" \
            --genesis-state="$BEACON_DIR/genesis.ssz" \
            --accept-terms-of-use
    fi
}

# Start Beacon Chain in background
start_beacon_chain_background() {
    echo -e "${YELLOW}Starting Prysm Beacon Chain in background...${NC}"
    
    if [ -f "./prysm.sh" ]; then
        nohup ./prysm.sh beacon-chain \
            --datadir="$BEACON_DIR" \
            --execution-endpoint="$EXECUTION_ENDPOINT" \
            --jwt-secret="$JWT_SECRET_FILE" \
            --chain-id="$NETWORK_ID" \
            --rpc-host="127.0.0.1" \
            --rpc-port="$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$BEACON_GRPC_PORT" \
            --p2p-tcp-port="$BEACON_P2P_PORT" \
            --p2p-udp-port="$BEACON_P2P_PORT" \
            --genesis-state="$BEACON_DIR/genesis.ssz" \
            --accept-terms-of-use \
 \
            > "$NETWORK_DIR/beacon.log" 2>&1 &
    else
        nohup prysm beacon-chain \
            --datadir="$BEACON_DIR" \
            --execution-endpoint="$EXECUTION_ENDPOINT" \
            --jwt-secret="$JWT_SECRET_FILE" \
            --chain-id="$NETWORK_ID" \
            --rpc-host="127.0.0.1" \
            --rpc-port="$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$BEACON_GRPC_PORT" \
            --p2p-tcp-port="$BEACON_P2P_PORT" \
            --p2p-udp-port="$BEACON_P2P_PORT" \
            --genesis-state="$BEACON_DIR/genesis.ssz" \
            --accept-terms-of-use \
 \
            > "$NETWORK_DIR/beacon.log" 2>&1 &
    fi
    
    BEACON_PID=$!
    echo $BEACON_PID > "$NETWORK_DIR/beacon.pid"
    echo -e "${GREEN}Beacon Chain started in background with PID: $BEACON_PID${NC}"
    echo -e "${BLUE}Log file: $NETWORK_DIR/beacon.log${NC}"
}

# Start Validator
start_validator() {
    echo -e "${YELLOW}Starting Prysm Validator...${NC}"
    echo -e "${BLUE}Validator gRPC: http://localhost:$VALIDATOR_GRPC_PORT${NC}"
    
    if [ -f "./prysm.sh" ]; then
        ./prysm.sh validator \
            --datadir="$VALIDATOR_DIR" \
            --beacon-rpc-provider="127.0.0.1:$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$VALIDATOR_GRPC_PORT" \
            --accept-terms-of-use \
            --wallet-dir="$VALIDATOR_DIR/wallet" \
            --wallet-password-file="$NETWORK_DIR/validator_password.txt"
    else
        prysm validator \
            --datadir="$VALIDATOR_DIR" \
            --beacon-rpc-provider="127.0.0.1:$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$VALIDATOR_GRPC_PORT" \
            --accept-terms-of-use \
            --wallet-dir="$VALIDATOR_DIR/wallet" \
            --wallet-password-file="$NETWORK_DIR/validator_password.txt"
    fi
}

# Start Validator in background
start_validator_background() {
    echo -e "${YELLOW}Starting Prysm Validator in background...${NC}"
    
    if [ -f "./prysm.sh" ]; then
        nohup ./prysm.sh validator \
            --datadir="$VALIDATOR_DIR" \
            --beacon-rpc-provider="127.0.0.1:$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$VALIDATOR_GRPC_PORT" \
            --accept-terms-of-use \
            --wallet-dir="$VALIDATOR_DIR/wallet" \
            --wallet-password-file="$NETWORK_DIR/validator_password.txt" \
 \
            > "$NETWORK_DIR/validator.log" 2>&1 &
    else
        nohup prysm validator \
            --datadir="$VALIDATOR_DIR" \
            --beacon-rpc-provider="127.0.0.1:$BEACON_RPC_PORT" \
            --grpc-gateway-host="127.0.0.1" \
            --grpc-gateway-port="$VALIDATOR_GRPC_PORT" \
            --accept-terms-of-use \
            --wallet-dir="$VALIDATOR_DIR/wallet" \
            --wallet-password-file="$NETWORK_DIR/validator_password.txt" \
 \
            > "$NETWORK_DIR/validator.log" 2>&1 &
    fi
    
    VALIDATOR_PID=$!
    echo $VALIDATOR_PID > "$NETWORK_DIR/validator.pid"
    echo -e "${GREEN}Validator started in background with PID: $VALIDATOR_PID${NC}"
    echo -e "${BLUE}Log file: $NETWORK_DIR/validator.log${NC}"
}

# Stop Prysm services
stop_prysm() {
    echo -e "${YELLOW}Stopping Prysm services...${NC}"
    
    # Stop beacon chain
    if [ -f "$NETWORK_DIR/beacon.pid" ]; then
        PID=$(cat "$NETWORK_DIR/beacon.pid")
        if ps -p $PID > /dev/null; then
            echo -e "${YELLOW}Stopping Beacon Chain (PID: $PID)...${NC}"
            kill $PID
            rm "$NETWORK_DIR/beacon.pid"
            echo -e "${GREEN}Beacon Chain stopped${NC}"
        else
            echo -e "${RED}Beacon Chain process not found${NC}"
            rm "$NETWORK_DIR/beacon.pid"
        fi
    fi
    
    # Stop validator
    if [ -f "$NETWORK_DIR/validator.pid" ]; then
        PID=$(cat "$NETWORK_DIR/validator.pid")
        if ps -p $PID > /dev/null; then
            echo -e "${YELLOW}Stopping Validator (PID: $PID)...${NC}"
            kill $PID
            rm "$NETWORK_DIR/validator.pid"
            echo -e "${GREEN}Validator stopped${NC}"
        else
            echo -e "${RED}Validator process not found${NC}"
            rm "$NETWORK_DIR/validator.pid"
        fi
    fi
}

# Check Prysm status
check_prysm_status() {
    echo -e "${BLUE}Checking Prysm status...${NC}"
    
    # Check beacon chain
    if [ -f "$NETWORK_DIR/beacon.pid" ]; then
        PID=$(cat "$NETWORK_DIR/beacon.pid")
        if ps -p $PID > /dev/null; then
            echo -e "${GREEN}Beacon Chain is running (PID: $PID)${NC}"
        else
            echo -e "${RED}Beacon Chain is not running${NC}"
            rm "$NETWORK_DIR/beacon.pid"
        fi
    else
        echo -e "${RED}Beacon Chain is not running${NC}"
    fi
    
    # Check validator
    if [ -f "$NETWORK_DIR/validator.pid" ]; then
        PID=$(cat "$NETWORK_DIR/validator.pid")
        if ps -p $PID > /dev/null; then
            echo -e "${GREEN}Validator is running (PID: $PID)${NC}"
        else
            echo -e "${RED}Validator is not running${NC}"
            rm "$NETWORK_DIR/validator.pid"
        fi
    else
        echo -e "${RED}Validator is not running${NC}"
    fi
}

# Main script logic
case "${1:-beacon}" in
    "beacon")
        check_prysm
        generate_genesis_state
        start_beacon_chain
        ;;
    "beacon-bg")
        check_prysm
        generate_genesis_state
        start_beacon_chain_background
        ;;
    "validator")
        start_validator
        ;;
    "validator-bg")
        start_validator_background
        ;;
    "start")
        check_prysm
        generate_genesis_state
        start_beacon_chain_background
        sleep 5
        start_validator_background
        ;;
    "stop")
        stop_prysm
        ;;
    "status")
        check_prysm_status
        ;;
    "restart")
        stop_prysm
        sleep 3
        check_prysm
        generate_genesis_state
        start_beacon_chain_background
        sleep 5
        start_validator_background
        ;;
    *)
        echo -e "${BLUE}Usage: $0 [beacon|beacon-bg|validator|validator-bg|start|stop|status|restart]${NC}"
        echo -e "${YELLOW}  beacon      - Start beacon chain in foreground${NC}"
        echo -e "${YELLOW}  beacon-bg   - Start beacon chain in background${NC}"
        echo -e "${YELLOW}  validator   - Start validator in foreground${NC}"
        echo -e "${YELLOW}  validator-bg - Start validator in background${NC}"
        echo -e "${YELLOW}  start       - Start both beacon chain and validator${NC}"
        echo -e "${YELLOW}  stop        - Stop all Prysm services${NC}"
        echo -e "${YELLOW}  status      - Check Prysm services status${NC}"
        echo -e "${YELLOW}  restart     - Restart all Prysm services${NC}"
        exit 1
        ;;
esac
