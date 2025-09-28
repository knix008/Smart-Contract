#!/bin/bash

# Start Kurtosis PoS Ethereum Private Network
# This script starts a Proof-of-Stake Ethereum private network using Kurtosis

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
NETWORK_NAME="ethereum-pos-network"
CONTAINER_NAME="kurtosis-pos-ethereum"
GETH_PORT_1=8545
GETH_PORT_2=8547
GETH_PORT_3=8549
LIGHTHOUSE_PORT=4000
DORA_PORT=8080
BLOCKSCOUT_PORT=4001
NETWORK_ID="1337"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to pull Kurtosis Ethereum module image
pull_kurtosis_image() {
    print_status "Pulling Kurtosis Ethereum module image..."
    if docker pull kurtosistech/ethereum-kurtosis-module:latest >/dev/null 2>&1; then
        print_success "Kurtosis image pulled successfully"
    else
        print_error "Failed to pull Kurtosis image"
        exit 1
    fi
}

# Function to stop existing container
stop_existing_container() {
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        print_status "Stopping existing container..."
        docker stop $CONTAINER_NAME >/dev/null 2>&1 || true
        print_success "Existing container stopped"
    fi
}

# Function to start Kurtosis PoS network
start_kurtosis_network() {
    print_status "Starting Kurtosis PoS Ethereum network..."
    print_status "Network ID: $NETWORK_ID"
    print_status "Geth RPC: http://localhost:$GETH_PORT_1"
    print_status "Lighthouse RPC: http://localhost:$LIGHTHOUSE_PORT"
    print_status "Dora Block Explorer: http://localhost:$DORA_PORT"
    print_status "Blockscout Explorer: http://localhost:$BLOCKSCOUT_PORT"
    
    # Kurtosis configuration - basic setup first
    KURTOSIS_CONFIG='{"enclaveId":"'$NETWORK_NAME'","apiContainerSocket":"/tmp/api.sock","serializedCustomParams":"{}","participants":[{"el_type":"geth","cl_type":"lighthouse","count":1}],"network_params":{"network_id":"'$NETWORK_ID'"}}'
    
    # Start the container
    CONTAINER_ID=$(docker run -d \
        --name $CONTAINER_NAME \
        -p $GETH_PORT_1:$GETH_PORT_1 \
        -p $LIGHTHOUSE_PORT:$LIGHTHOUSE_PORT \
        -e SERIALIZED_ARGS="$KURTOSIS_CONFIG" \
        kurtosistech/ethereum-kurtosis-module:latest)
    
    if [ $? -eq 0 ]; then
        print_success "Kurtosis PoS network started successfully!"
        print_status "Container ID: $CONTAINER_ID"
        print_status "Container Name: $CONTAINER_NAME"
    else
        print_error "Failed to start Kurtosis network"
        exit 1
    fi
}

# Function to wait for network to be ready
wait_for_network() {
    print_status "Waiting for network to initialize..."
    print_info "This may take 2-3 minutes for the PoS network to fully start..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        print_status "Attempt $attempt/$max_attempts - Checking network status..."
        
        # Check if container is still running
        if ! docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
            print_error "Container stopped unexpectedly"
            docker logs $CONTAINER_NAME --tail 20
            exit 1
        fi
        
        # Try to connect to Geth (check first node)
        if curl -s -X POST -H "Content-Type: application/json" \
            --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
            http://localhost:$GETH_PORT_1 >/dev/null 2>&1; then
            print_success "Network is ready!"
            return 0
        fi
        
        print_status "Network not ready yet, waiting 10 seconds..."
        sleep 10
        attempt=$((attempt + 1))
    done
    
    print_warning "Network may still be initializing. You can check status manually."
}

# Function to show network status
show_network_status() {
    print_status "Checking network status..."
    
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        print_success "Container is running"
        
        # Get container info
        CONTAINER_INFO=$(docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}")
        echo "$CONTAINER_INFO"
        
        # Test network connectivity
        print_status "Testing network connectivity..."
        
        # Test Geth
        if curl -s -X POST -H "Content-Type: application/json" \
            --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
            http://localhost:$GETH_PORT_1 | grep -q "0x539"; then
            print_success "Geth RPC is responding (Chain ID: 1337)"
        else
            print_warning "Geth RPC not responding yet"
        fi
        
        # Test Lighthouse
        if curl -s http://localhost:$LIGHTHOUSE_PORT/eth/v1/node/syncing >/dev/null 2>&1; then
            print_success "Lighthouse RPC is responding"
        else
            print_warning "Lighthouse RPC not responding yet"
        fi
        
        # Test Dora Block Explorer
        if curl -s http://localhost:$DORA_PORT >/dev/null 2>&1; then
            print_success "Dora Block Explorer is responding"
        else
            print_warning "Dora Block Explorer not responding yet"
        fi
        
        # Test Blockscout Explorer
        if curl -s http://localhost:$BLOCKSCOUT_PORT >/dev/null 2>&1; then
            print_success "Blockscout Explorer is responding"
        else
            print_warning "Blockscout Explorer not responding yet"
        fi
        
    else
        print_error "Container is not running"
        exit 1
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing Kurtosis network logs..."
    docker logs $CONTAINER_NAME -f
}

# Function to stop network
stop_network() {
    print_status "Stopping Kurtosis PoS network..."
    
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        docker stop $CONTAINER_NAME >/dev/null 2>&1
        print_success "Network stopped successfully"
    else
        print_warning "Network is not running"
    fi
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    stop_network
    docker rm $CONTAINER_NAME >/dev/null 2>&1 || true
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo -e "${PURPLE}Kurtosis PoS Ethereum Network Manager${NC}"
    echo ""
    echo -e "${YELLOW}Usage: $0 [command]${NC}"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo -e "  ${GREEN}start${NC}     - Start the Kurtosis PoS network"
    echo -e "  ${GREEN}stop${NC}      - Stop the Kurtosis PoS network"
    echo -e "  ${GREEN}status${NC}    - Show network status"
    echo -e "  ${GREEN}logs${NC}      - Show network logs"
    echo -e "  ${GREEN}restart${NC}   - Restart the network"
    echo -e "  ${GREEN}cleanup${NC}   - Stop and remove container"
    echo -e "  ${GREEN}help${NC}      - Show this help message"
    echo ""
    echo -e "${YELLOW}Network Details:${NC}"
    echo -e "  ${GREEN}Network ID${NC}: $NETWORK_ID"
    echo -e "  ${GREEN}Geth RPC${NC}: http://localhost:$GETH_PORT"
    echo -e "  ${GREEN}Lighthouse RPC${NC}: http://localhost:$LIGHTHOUSE_PORT"
    echo -e "  ${GREEN}Consensus${NC}: Proof-of-Stake (PoS)"
    echo -e "  ${GREEN}Clients${NC}: Geth + Lighthouse"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 start"
    echo -e "  $0 status"
    echo -e "  $0 logs"
    echo -e "  $0 stop"
}

# Main script logic
case "${1:-help}" in
    "start")
        echo -e "${PURPLE}================================${NC}"
        echo -e "${PURPLE}Starting Kurtosis PoS Network${NC}"
        echo -e "${PURPLE}================================${NC}"
        check_docker
        pull_kurtosis_image
        stop_existing_container
        start_kurtosis_network
        wait_for_network
        show_network_status
        ;;
    "stop")
        stop_network
        ;;
    "status")
        show_network_status
        ;;
    "logs")
        show_logs
        ;;
    "restart")
        stop_network
        sleep 2
        $0 start
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|*)
        show_help
        ;;
esac
