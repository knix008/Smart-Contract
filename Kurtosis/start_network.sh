#!/bin/bash

set -e

echo "======================================"
echo "Starting Private PoS Ethereum Network"
echo "======================================"

# Network configuration
ENCLAVE_NAME="ethereum-net"
CONFIG_FILE="network_params.yaml"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Kurtosis is installed
if ! command -v kurtosis &> /dev/null; then
    echo "Error: Kurtosis is not installed. Please run ./install.sh first"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "Error: Docker is not running. Please start Docker first"
    exit 1
fi

# Stop any existing Kurtosis engine and clean up
echo -e "\n[1/5] Cleaning up existing Kurtosis resources..."
kurtosis engine stop 2>/dev/null || true
kurtosis enclave rm -f $ENCLAVE_NAME 2>/dev/null || true

# Clean up any orphaned containers
echo "Removing orphaned containers..."
docker rm -f $(docker ps -aq --filter "name=kurtosis") 2>/dev/null || true

# Start Kurtosis engine
echo -e "\n[2/5] Starting Kurtosis engine..."
kurtosis engine start

# Wait a moment for engine to be ready
sleep 3

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}Warning: $CONFIG_FILE not found. Using default configuration.${NC}"
    CONFIG_ARG=""
else
    CONFIG_ARG="--args-file $CONFIG_FILE"
fi

# Run the Ethereum package
echo -e "\n[3/5] Launching Ethereum network..."
echo "This may take several minutes to download images and start services..."

kurtosis run github.com/ethpandaops/ethereum-package \
    --enclave $ENCLAVE_NAME \
    $CONFIG_ARG

# Get enclave information
echo -e "\n[4/5] Network deployed successfully!"
echo -e "\n${GREEN}=== Network Information ===${NC}"
kurtosis enclave inspect $ENCLAVE_NAME

# Display useful commands
echo -e "\n[5/5] ${GREEN}=== Useful Commands ===${NC}"
echo "View all services:"
echo "  kurtosis enclave inspect $ENCLAVE_NAME"
echo ""
echo "View service logs (replace SERVICE_NAME):"
echo "  kurtosis service logs $ENCLAVE_NAME SERVICE_NAME"
echo ""
echo "Get service shell access:"
echo "  kurtosis service shell $ENCLAVE_NAME SERVICE_NAME"
echo ""
echo "Stop the network:"
echo "  ./stop_network.sh"
echo ""
echo "View network in browser:"
echo "  kurtosis web"
echo ""

echo -e "${GREEN}======================================"
echo "Network is ready!"
echo "======================================${NC}"
