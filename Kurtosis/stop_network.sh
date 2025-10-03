#!/bin/bash

set -e

echo "======================================"
echo "Stopping Private PoS Ethereum Network"
echo "======================================"

ENCLAVE_NAME="ethereum-net"

# Stop the enclave
echo -e "\n[1/2] Stopping enclave: $ENCLAVE_NAME..."
kurtosis enclave stop $ENCLAVE_NAME 2>/dev/null || echo "Enclave not running"

# Remove the enclave
echo -e "\n[2/2] Removing enclave: $ENCLAVE_NAME..."
kurtosis enclave rm -f $ENCLAVE_NAME 2>/dev/null || echo "Enclave already removed"

echo -e "\n======================================"
echo "Network stopped and cleaned up!"
echo "======================================"
echo ""
echo "To start the network again, run:"
echo "  ./start_network.sh"
