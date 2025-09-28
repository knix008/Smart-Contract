#!/bin/bash

# Start Multiple Geth Nodes for Ethereum Private Network
# This script starts 3 Geth nodes with different ports and peer discovery

set -e

# Add local bin to PATH for Geth
export PATH="$HOME/.local/bin:$PATH"

# Configuration
NETWORK_DIR="./network"
ACCOUNTS_DIR="$NETWORK_DIR/accounts"
GENESIS_FILE="./genesis.json"
JWT_SECRET_FILE="$NETWORK_DIR/jwt.hex"
PASSWORD_FILE="$ACCOUNTS_DIR/passwords.txt"

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

# Node configurations
declare -A NODES=(
    ["node1"]="8545:8546:8551:30303"
    ["node2"]="8547:8548:8552:30304"
    ["node3"]="8549:8550:8553:30305"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Multiple Geth Nodes...${NC}"

# Create directories
mkdir -p "$NETWORK_DIR"

# Generate JWT secret if it doesn't exist
if [ ! -f "$JWT_SECRET_FILE" ]; then
    echo -e "${YELLOW}Generating JWT secret...${NC}"
    openssl rand -hex 32 | tr -d "\n" > "$JWT_SECRET_FILE"
    echo -e "${GREEN}JWT secret generated: $JWT_SECRET_FILE${NC}"
fi

# Function to initialize node
init_node() {
    local node_name=$1
    local node_dir="$NETWORK_DIR/$node_name"
    
    echo -e "${YELLOW}Initializing $node_name...${NC}"
    
    # Create node directory
    mkdir -p "$node_dir"
    
    # Initialize with genesis for PoS network
    if [ ! -d "$node_dir/geth" ]; then
        echo -e "${YELLOW}Initializing $node_name with genesis block...${NC}"
        $GETH_CMD init --datadir "$node_dir" "$GENESIS_FILE"
        echo -e "${GREEN}$node_name initialized with genesis block${NC}"
    fi
    
    # Copy accounts to node directory
    if [ -d "$ACCOUNTS_DIR" ]; then
        cp -r "$ACCOUNTS_DIR"/* "$node_dir/" 2>/dev/null || true
    fi
}

# Function to start a single node
start_node() {
    local node_name=$1
    local ports=${NODES[$node_name]}
    local http_port=$(echo $ports | cut -d':' -f1)
    local ws_port=$(echo $ports | cut -d':' -f2)
    local auth_port=$(echo $ports | cut -d':' -f3)
    local p2p_port=$(echo $ports | cut -d':' -f4)
    
    local node_dir="$NETWORK_DIR/$node_name"
    local log_file="$NETWORK_DIR/${node_name}.log"
    local pid_file="$NETWORK_DIR/${node_name}.pid"
    
    echo -e "${YELLOW}Starting $node_name...${NC}"
    echo -e "${BLUE}  HTTP RPC: http://localhost:$http_port${NC}"
    echo -e "${BLUE}  WebSocket: ws://localhost:$ws_port${NC}"
    echo -e "${BLUE}  Auth RPC: http://localhost:$auth_port${NC}"
    echo -e "${BLUE}  P2P Port: $p2p_port${NC}"
    
    # For now, we'll use --nodiscover to keep nodes isolated
    # In a real setup, you would configure proper peer discovery
    local bootnode_arg=""
    
    # Start node in background for PoS network
    nohup $GETH_CMD \
        --datadir "$node_dir" \
        --networkid "$NETWORK_ID" \
        --identity "$node_name" \
        --http \
        --http.addr "0.0.0.0" \
        --http.port "$http_port" \
        --http.api "eth,net,web3,personal,miner,admin,txpool,debug,engine" \
        --http.corsdomain "*" \
        --http.vhosts "*" \
        --ws \
        --ws.addr "0.0.0.0" \
        --ws.port "$ws_port" \
        --ws.api "eth,net,web3,personal,miner,admin,txpool,debug,engine" \
        --ws.origins "*" \
        --authrpc.addr "127.0.0.1" \
        --authrpc.port "$auth_port" \
        --authrpc.jwtsecret "$JWT_SECRET_FILE" \
        --port "$p2p_port" \
        --nodiscover \
        --allow-insecure-unlock \
        --verbosity 3 \
        $bootnode_arg \
        > "$log_file" 2>&1 &
    
    local pid=$!
    echo $pid > "$pid_file"
    echo -e "${GREEN}$node_name started with PID: $pid${NC}"
    echo -e "${BLUE}Log file: $log_file${NC}"
}

# Function to get enode URL for a node
get_enode_url() {
    local node_name=$1
    local node_dir="$NETWORK_DIR/$node_name"
    
    # Try to get enode from the node's admin API
    local http_port=$(echo ${NODES[$node_name]} | cut -d':' -f1)
    sleep 2  # Wait for node to start
    
    # Get enode URL
    local enode=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"jsonrpc":"2.0","method":"admin_nodeInfo","params":[],"id":1}' \
        http://localhost:$http_port | \
        python3 -c "import sys, json; data=json.load(sys.stdin); print(data['result']['enode'])" 2>/dev/null || echo "")
    
    echo "$enode"
}

# Function to start all nodes
start_all_nodes() {
    echo -e "${BLUE}Starting all Geth nodes...${NC}"
    
    # Initialize all nodes first
    for node_name in "${!NODES[@]}"; do
        init_node "$node_name"
    done
    
    # Start node1 first (as bootnode)
    start_node "node1"
    sleep 3
    
    # Start other nodes
    for node_name in "${!NODES[@]}"; do
        if [ "$node_name" != "node1" ]; then
            start_node "$node_name"
            sleep 2
        fi
    done
    
    echo -e "${GREEN}All nodes started successfully!${NC}"
    echo ""
    show_status
}

# Function to stop all nodes
stop_all_nodes() {
    echo -e "${BLUE}Stopping all Geth nodes...${NC}"
    
    for node_name in "${!NODES[@]}"; do
        local pid_file="$NETWORK_DIR/${node_name}.pid"
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            if ps -p $pid > /dev/null; then
                echo -e "${YELLOW}Stopping $node_name (PID: $pid)...${NC}"
                kill $pid
                rm "$pid_file"
                echo -e "${GREEN}$node_name stopped${NC}"
            else
                echo -e "${RED}$node_name process not found${NC}"
                rm "$pid_file"
            fi
        fi
    done
}

# Function to show status
show_status() {
    echo -e "${BLUE}Multi-Node Network Status:${NC}"
    echo ""
    
    for node_name in "${!NODES[@]}"; do
        local ports=${NODES[$node_name]}
        local http_port=$(echo $ports | cut -d':' -f1)
        local ws_port=$(echo $ports | cut -d':' -f2)
        local auth_port=$(echo $ports | cut -d':' -f3)
        local p2p_port=$(echo $ports | cut -d':' -f4)
        
        local pid_file="$NETWORK_DIR/${node_name}.pid"
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            if ps -p $pid > /dev/null; then
                echo -e "${GREEN}✓ $node_name is running (PID: $pid)${NC}"
                echo -e "${BLUE}  HTTP RPC: http://localhost:$http_port${NC}"
                echo -e "${BLUE}  WebSocket: ws://localhost:$ws_port${NC}"
                echo -e "${BLUE}  Auth RPC: http://localhost:$auth_port${NC}"
                echo -e "${BLUE}  P2P Port: $p2p_port${NC}"
            else
                echo -e "${RED}✗ $node_name is not running${NC}"
                rm "$pid_file"
            fi
        else
            echo -e "${RED}✗ $node_name is not running${NC}"
        fi
        echo ""
    done
}

# Function to show logs
show_logs() {
    local node_name=${1:-"all"}
    
    if [ "$node_name" = "all" ]; then
        echo -e "${BLUE}All node logs (press Ctrl+C to stop):${NC}"
        if [ -f "$NETWORK_DIR/node1.log" ] && [ -f "$NETWORK_DIR/node2.log" ] && [ -f "$NETWORK_DIR/node3.log" ]; then
            tail -f "$NETWORK_DIR/node1.log" "$NETWORK_DIR/node2.log" "$NETWORK_DIR/node3.log" 2>/dev/null || true
        else
            echo -e "${RED}Log files not found${NC}"
        fi
    else
        local log_file="$NETWORK_DIR/${node_name}.log"
        if [ -f "$log_file" ]; then
            echo -e "${BLUE}$node_name logs:${NC}"
            tail -f "$log_file"
        else
            echo -e "${RED}Log file not found: $log_file${NC}"
        fi
    fi
}

# Main script logic
case "${1:-start}" in
    "start")
        start_all_nodes
        ;;
    "stop")
        stop_all_nodes
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "restart")
        stop_all_nodes
        sleep 3
        start_all_nodes
        ;;
    *)
        echo -e "${BLUE}Usage: $0 [start|stop|status|logs|restart]${NC}"
        echo -e "${YELLOW}  start    - Start all 3 Geth nodes${NC}"
        echo -e "${YELLOW}  stop     - Stop all Geth nodes${NC}"
        echo -e "${YELLOW}  status   - Show status of all nodes${NC}"
        echo -e "${YELLOW}  logs     - Show logs (all nodes or specify node1|node2|node3)${NC}"
        echo -e "${YELLOW}  restart  - Restart all nodes${NC}"
        exit 1
        ;;
esac
