#!/bin/bash

# Script to start the private PoS Ethereum network using Kurtosis

set -e

echo "🚀 Starting private PoS Ethereum network..."

# Check if Kurtosis CLI is installed
if ! command -v kurtosis &> /dev/null; then
    echo "❌ Kurtosis CLI is not installed. Please run ./scripts/install-kurtosis.sh first."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start the network
echo "🌐 Launching private PoS Ethereum network..."
kurtosis run .

echo "✅ Network started successfully!"
echo ""
echo "📋 Useful commands:"
echo "  - View running enclaves: kurtosis enclave ls"
echo "  - Stop the network: kurtosis enclave stop <enclave-name>"
echo "  - View logs: kurtosis enclave logs <enclave-name>"
echo "  - Connect to a node: kurtosis enclave shell <enclave-name> <service-name>"
echo ""
echo "🔗 Network details:"
echo "  - Network ID: 3151908"
echo "  - Chain ID: 3151908"
echo "  - Genesis delay: 10 seconds"
echo "  - 3 Geth nodes for execution layer"
echo "  - Lighthouse nodes for consensus layer"
echo "  - Dora Explorer: http://localhost:3000"
echo "  - Blockscout Explorer: http://localhost:4000"
