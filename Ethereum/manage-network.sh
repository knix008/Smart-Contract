#!/bin/bash

# Ethereum Private Network Manager
# This script manages the entire Ethereum private network with Geth and Prysm

set -e

# Add local bin to PATH for Geth
export PATH="$HOME/.local/bin:$PATH"

# Configuration
NETWORK_DIR="./network"
SCRIPTS_DIR="."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print header
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  Ethereum Private Network Manager${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo ""
}

# Function to install Geth
install_geth() {
    echo -e "${YELLOW}Downloading Geth...${NC}"
    
    # Download latest Geth version
    GETH_URL="https://gethstore.blob.core.windows.net/builds/geth-linux-amd64-1.16.4-41714b49.tar.gz"
    GETH_FILE="geth-linux-amd64-1.16.4-41714b49.tar.gz"
    
    # Check if already downloaded
    if [ ! -f "$GETH_FILE" ]; then
        wget -O "$GETH_FILE" "$GETH_URL" || {
            echo -e "${RED}Failed to download Geth${NC}"
            exit 1
        }
    fi
    
    # Extract Geth
    echo -e "${YELLOW}Extracting Geth...${NC}"
    tar -xzf "$GETH_FILE" || {
        echo -e "${RED}Failed to extract Geth${NC}"
        exit 1
    }
    
    # Move Geth to local bin directory
    GETH_DIR="geth-linux-amd64-1.16.4-41714b49"
    mkdir -p "$HOME/.local/bin"
    cp "$GETH_DIR/geth" "$HOME/.local/bin/" || {
        echo -e "${RED}Failed to copy Geth to bin directory${NC}"
        exit 1
    }
    
    # Make Geth executable
    chmod +x "$HOME/.local/bin/geth"
    
    # Add to PATH if not already there
    if ! echo "$PATH" | grep -q "$HOME/.local/bin"; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
        export PATH="$HOME/.local/bin:$PATH"
        echo -e "${YELLOW}Added $HOME/.local/bin to PATH${NC}"
        echo -e "${YELLOW}Please run 'source ~/.bashrc' or restart your terminal${NC}"
    fi
    
    # Clean up
    rm -rf "$GETH_DIR"
    
    echo -e "${GREEN}✓ Geth installed successfully${NC}"
    echo -e "${BLUE}Geth version: $($HOME/.local/bin/geth version | head -n1)${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}Checking prerequisites...${NC}"
    
    # Check if geth is installed
    if ! command -v geth &> /dev/null; then
        echo -e "${YELLOW}Geth not found. Installing Geth...${NC}"
        install_geth
    else
        echo -e "${GREEN}✓ Geth is installed${NC}"
    fi
    
    # Check if prysm is available (either as command or script)
    if ! command -v prysm &> /dev/null && [ ! -f "./prysm.sh" ]; then
        echo -e "${YELLOW}⚠ Prysm not found. Will download during setup.${NC}"
    else
        echo -e "${GREEN}✓ Prysm is available${NC}"
    fi
    
    # Check if openssl is installed
    if ! command -v openssl &> /dev/null; then
        echo -e "${RED}OpenSSL is not installed. Please install OpenSSL first.${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ OpenSSL is installed${NC}"
    fi
    
    # Check if python3 is installed
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Python3 is not installed. Please install Python3 first.${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ Python3 is installed${NC}"
    fi
    
    echo -e "${GREEN}All prerequisites satisfied!${NC}"
    echo ""
}

# Function to setup network
setup_network() {
    echo -e "${BLUE}Setting up Ethereum private network...${NC}"
    
    # Create network directory
    mkdir -p "$NETWORK_DIR"
    
    # Setup accounts
    echo -e "${YELLOW}Setting up accounts...${NC}"
    if [ -f "$SCRIPTS_DIR/setup-accounts.sh" ]; then
        bash "$SCRIPTS_DIR/setup-accounts.sh"
    else
        echo -e "${RED}setup-accounts.sh not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Network setup completed!${NC}"
    echo ""
}

# Function to start network
start_network() {
    echo -e "${BLUE}Starting Ethereum private network...${NC}"
    
    # Start multiple Geth nodes
    echo -e "${YELLOW}Starting multiple Geth execution clients...${NC}"
    if [ -f "$SCRIPTS_DIR/start-multi-geth.sh" ]; then
        bash "$SCRIPTS_DIR/start-multi-geth.sh" start
        sleep 5
    elif [ -f "$SCRIPTS_DIR/start-geth.sh" ]; then
        echo -e "${YELLOW}Falling back to single Geth node...${NC}"
        bash "$SCRIPTS_DIR/start-geth.sh" background
        sleep 5
    else
        echo -e "${RED}No Geth startup script found${NC}"
        exit 1
    fi
    
    # Wait for Geth nodes to be ready
    echo -e "${YELLOW}Waiting for Geth nodes to be ready...${NC}"
    sleep 10
    
    # Start Prysm
    echo -e "${YELLOW}Starting Prysm consensus client...${NC}"
    if [ -f "$SCRIPTS_DIR/start-prysm.sh" ]; then
        bash "$SCRIPTS_DIR/start-prysm.sh" start
    else
        echo -e "${RED}start-prysm.sh not found${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Ethereum private network started successfully!${NC}"
    echo ""
    show_status
}

# Function to stop network
stop_network() {
    echo -e "${BLUE}Stopping Ethereum private network...${NC}"
    
    # Stop Prysm
    if [ -f "$SCRIPTS_DIR/start-prysm.sh" ]; then
        echo -e "${YELLOW}Stopping Prysm...${NC}"
        bash "$SCRIPTS_DIR/start-prysm.sh" stop
    fi
    
    # Stop multiple Geth nodes
    if [ -f "$SCRIPTS_DIR/start-multi-geth.sh" ]; then
        echo -e "${YELLOW}Stopping multiple Geth nodes...${NC}"
        bash "$SCRIPTS_DIR/start-multi-geth.sh" stop
    elif [ -f "$SCRIPTS_DIR/start-geth.sh" ]; then
        echo -e "${YELLOW}Stopping single Geth node...${NC}"
        bash "$SCRIPTS_DIR/start-geth.sh" stop
    fi
    
    echo -e "${GREEN}Ethereum private network stopped!${NC}"
    echo ""
}

# Function to restart network
restart_network() {
    echo -e "${BLUE}Restarting Ethereum private network...${NC}"
    stop_network
    sleep 3
    start_network
}

# Function to show status
show_status() {
    echo -e "${BLUE}Network Status:${NC}"
    echo ""
    
    # Check Geth status (multiple nodes)
    echo -e "${YELLOW}Geth (Execution Clients):${NC}"
    if [ -f "$SCRIPTS_DIR/start-multi-geth.sh" ]; then
        bash "$SCRIPTS_DIR/start-multi-geth.sh" status
    elif [ -f "$SCRIPTS_DIR/start-geth.sh" ]; then
        bash "$SCRIPTS_DIR/start-geth.sh" status
    else
        echo -e "${RED}No Geth startup script found${NC}"
    fi
    echo ""
    
    # Check Prysm status
    echo -e "${YELLOW}Prysm (Consensus Client):${NC}"
    if [ -f "$SCRIPTS_DIR/start-prysm.sh" ]; then
        bash "$SCRIPTS_DIR/start-prysm.sh" status
    else
        echo -e "${RED}start-prysm.sh not found${NC}"
    fi
    echo ""
    
    # Show network information
    echo -e "${YELLOW}Network Information:${NC}"
    echo -e "${BLUE}  Network ID: 1337${NC}"
    echo -e "${BLUE}  Node 1 - HTTP RPC: http://localhost:8545${NC}"
    echo -e "${BLUE}  Node 1 - WebSocket: ws://localhost:8546${NC}"
    echo -e "${BLUE}  Node 2 - HTTP RPC: http://localhost:8547${NC}"
    echo -e "${BLUE}  Node 2 - WebSocket: ws://localhost:8548${NC}"
    echo -e "${BLUE}  Node 3 - HTTP RPC: http://localhost:8549${NC}"
    echo -e "${BLUE}  Node 3 - WebSocket: ws://localhost:8550${NC}"
    echo -e "${BLUE}  Beacon RPC: http://localhost:4000${NC}"
    echo -e "${BLUE}  Beacon gRPC: http://localhost:4001${NC}"
    echo ""
}

# Function to show logs
show_logs() {
    local service=${1:-"all"}
    
    case $service in
        "geth"|"execution"|"node1"|"node2"|"node3")
            if [ -f "$SCRIPTS_DIR/start-multi-geth.sh" ]; then
                bash "$SCRIPTS_DIR/start-multi-geth.sh" logs "$service"
            elif [ -f "$NETWORK_DIR/geth.log" ]; then
                echo -e "${BLUE}Geth logs:${NC}"
                tail -f "$NETWORK_DIR/geth.log"
            else
                echo -e "${RED}Geth log file not found${NC}"
            fi
            ;;
        "beacon"|"prysm")
            if [ -f "$NETWORK_DIR/beacon.log" ]; then
                echo -e "${BLUE}Prysm Beacon logs:${NC}"
                tail -f "$NETWORK_DIR/beacon.log"
            else
                echo -e "${RED}Beacon log file not found${NC}"
            fi
            ;;
        "validator")
            if [ -f "$NETWORK_DIR/validator.log" ]; then
                echo -e "${BLUE}Prysm Validator logs:${NC}"
                tail -f "$NETWORK_DIR/validator.log"
            else
                echo -e "${RED}Validator log file not found${NC}"
            fi
            ;;
        "all")
            echo -e "${BLUE}All logs (press Ctrl+C to stop):${NC}"
            if [ -f "$SCRIPTS_DIR/start-multi-geth.sh" ]; then
                bash "$SCRIPTS_DIR/start-multi-geth.sh" logs all
            elif [ -f "$NETWORK_DIR/geth.log" ] && [ -f "$NETWORK_DIR/beacon.log" ]; then
                tail -f "$NETWORK_DIR/geth.log" "$NETWORK_DIR/beacon.log" "$NETWORK_DIR/validator.log" 2>/dev/null || true
            else
                echo -e "${RED}Log files not found${NC}"
            fi
            ;;
        *)
            echo -e "${RED}Invalid service: $service${NC}"
            echo -e "${YELLOW}Available services: geth, node1, node2, node3, beacon, validator, all${NC}"
            ;;
    esac
}

# Function to clean network
clean_network() {
    echo -e "${YELLOW}This will remove all network data. Are you sure? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${BLUE}Cleaning network data...${NC}"
        
        # Stop network first
        stop_network
        
        # Remove network directory
        if [ -d "$NETWORK_DIR" ]; then
            rm -rf "$NETWORK_DIR"
            echo -e "${GREEN}Network data removed${NC}"
        fi
        
        # Remove Prysm installation script
        if [ -f "./prysm.sh" ]; then
            rm "./prysm.sh"
            echo -e "${GREEN}Prysm script removed${NC}"
        fi
        
        echo -e "${GREEN}Network cleanup completed!${NC}"
    else
        echo -e "${YELLOW}Cleanup cancelled${NC}"
    fi
}

# Function to show help
show_help() {
    echo -e "${BLUE}Usage: $0 [command]${NC}"
    echo ""
    echo -e "${YELLOW}Ethereum PoS Private Network Manager${NC}"
    echo -e "${BLUE}This script manages a complete Proof-of-Stake Ethereum private network${NC}"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo -e "  ${GREEN}setup${NC}     - Setup the PoS private network (first time)"
    echo -e "  ${GREEN}start${NC}     - Start the PoS private network"
    echo -e "  ${GREEN}stop${NC}      - Stop the PoS private network"
    echo -e "  ${GREEN}restart${NC}   - Restart the PoS private network"
    echo -e "  ${GREEN}status${NC}    - Show network status"
    echo -e "  ${GREEN}logs${NC}      - Show logs (all services)"
    echo -e "  ${GREEN}logs [service]${NC} - Show logs for specific service"
    echo -e "  ${GREEN}clean${NC}     - Clean all network data"
    echo -e "  ${GREEN}help${NC}      - Show this help message"
    echo ""
    echo -e "${YELLOW}Network Components:${NC}"
    echo -e "  ${GREEN}3 Geth Nodes${NC} - Execution layer (Chain ID: 1337)"
    echo -e "  ${GREEN}Prysm Beacon${NC} - Consensus layer beacon chain"
    echo -e "  ${GREEN}Prysm Validator${NC} - Consensus layer validator"
    echo ""
    echo -e "${YELLOW}Available services for logs:${NC}"
    echo -e "  ${GREEN}geth${NC}      - All Geth execution client logs"
    echo -e "  ${GREEN}node1${NC}     - Node 1 logs (HTTP: 8545)"
    echo -e "  ${GREEN}node2${NC}     - Node 2 logs (HTTP: 8547)"
    echo -e "  ${GREEN}node3${NC}     - Node 3 logs (HTTP: 8549)"
    echo -e "  ${GREEN}beacon${NC}    - Prysm beacon chain logs"
    echo -e "  ${GREEN}validator${NC} - Prysm validator logs"
    echo -e "  ${GREEN}all${NC}       - All logs (default)"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 setup"
    echo -e "  $0 start"
    echo -e "  $0 logs node1"
    echo -e "  $0 logs all"
    echo -e "  $0 status"
}

# Main script logic
print_header

case "${1:-help}" in
    "setup")
        check_prerequisites
        setup_network
        ;;
    "start")
        start_network
        ;;
    "stop")
        stop_network
        ;;
    "restart")
        restart_network
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs "$2"
        ;;
    "clean")
        clean_network
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
