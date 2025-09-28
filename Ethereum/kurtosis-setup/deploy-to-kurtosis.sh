#!/bin/bash

# Script to deploy ERC-20 smart contract to Kurtosis PoS Ethereum Network

set -e

# Configuration
SMART_CONTRACT_DIR="../SmartContract"
CONTAINER_NAME="kurtosis-pos-ethereum"
GETH_PORT_1=8545
GETH_PORT_2=8547
GETH_PORT_3=8549

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
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

# Function to show help
show_help() {
    echo -e "${BLUE}Usage: $0 [command]${NC}"
    echo ""
    echo -e "${YELLOW}Smart Contract Deployment for Kurtosis PoS Network${NC}"
    echo ""
    echo -e "${YELLOW}Commands:${NC}"
    echo -e "  ${GREEN}deploy${NC}     - Deploy smart contract to Kurtosis PoS network"
    echo -e "  ${GREEN}check${NC}      - Check if Kurtosis network is running"
    echo -e "  ${GREEN}help${NC}       - Show this help message"
    echo ""
    echo -e "${YELLOW}Available Geth Nodes:${NC}"
    echo -e "  ${GREEN}Node 1${NC}     - HTTP RPC: http://localhost:$GETH_PORT_1"
    echo -e "  ${GREEN}Node 2${NC}     - HTTP RPC: http://localhost:$GETH_PORT_2"
    echo -e "  ${GREEN}Node 3${NC}     - HTTP RPC: http://localhost:$GETH_PORT_3"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0 deploy"
    echo -e "  $0 check"
}

# Function to check if Kurtosis network is running
check_kurtosis_network() {
    print_status "Checking if Kurtosis PoS network is running..."
    
    if docker ps -q -f name=$CONTAINER_NAME | grep -q .; then
        print_success "Kurtosis container is running"
        
        # Test connectivity to all Geth nodes
        for i in 1 2 3; do
            case $i in
                1) port=$GETH_PORT_1 ;;
                2) port=$GETH_PORT_2 ;;
                3) port=$GETH_PORT_3 ;;
            esac
            
            if curl -s -X POST -H "Content-Type: application/json" \
                --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
                http://localhost:$port >/dev/null 2>&1; then
                print_success "Geth Node $i is responding on port $port"
            else
                print_warning "Geth Node $i not responding on port $port"
            fi
        done
        
        return 0
    else
        print_error "Kurtosis container is not running"
        print_status "Please start the Kurtosis network first:"
        print_status "  ./start-kurtosis-pos.sh start"
        return 1
    fi
}

# Function to deploy smart contract
deploy_smart_contract() {
    print_status "Starting smart contract deployment to Kurtosis PoS network..."
    
    # Check if Kurtosis network is running
    if ! check_kurtosis_network; then
        exit 1
    fi
    
    # Check if the SmartContract directory exists
    if [ ! -d "$SMART_CONTRACT_DIR" ]; then
        print_error "Smart contract directory '$SMART_CONTRACT_DIR' not found."
        print_error "Please ensure you are running this script from the 'kurtosis-setup' directory."
        exit 1
    fi
    
    # Navigate to the SmartContract directory
    print_status "Navigating to smart contract directory: $SMART_CONTRACT_DIR"
    cd "$SMART_CONTRACT_DIR"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        print_error "package.json not found in SmartContract directory"
        print_error "Please ensure the smart contract project is properly set up"
        exit 1
    fi
    
    # Install Node.js dependencies
    print_status "Installing Node.js dependencies..."
    if npm install >/dev/null 2>&1; then
        print_success "Dependencies installed successfully"
    else
        print_warning "npm install had some issues, but continuing..."
    fi
    
    # Update deploy.js to use the first Geth node
    print_status "Configuring deployment to use Geth Node 1 (port $GETH_PORT_1)..."
    
    # Check if deploy.js exists
    if [ ! -f "deploy.js" ]; then
        print_error "deploy.js not found in SmartContract directory"
        print_error "Please ensure the deployment script exists"
        exit 1
    fi
    
    # Run the deployment script
    print_status "Running smart contract deployment script..."
    print_status "This will deploy to Geth Node 1 on port $GETH_PORT_1"
    
    if npm run deploy; then
        print_success "Smart contract deployment completed successfully!"
        print_status "Contract deployed to Kurtosis PoS network via Geth Node 1"
    else
        print_error "Smart contract deployment failed"
        print_status "Check the logs above for more details"
        exit 1
    fi
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        deploy_smart_contract
        ;;
    "check")
        check_kurtosis_network
        ;;
    "help"|*)
        show_help
        ;;
esac
