#!/bin/bash

# Start Ethereum Private Network with Kurtosis
# This script starts a private Ethereum network using Kurtosis

set -e

echo "🚀 Starting Ethereum Private Network with Kurtosis..."

# Check if Kurtosis is installed
if ! command -v kurtosis &> /dev/null; then
    echo "❌ Kurtosis is not installed. Please run ./install-kurtosis.sh first."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start the network
echo "📡 Starting network with configuration from network_params.yaml..."
kurtosis run github.com/ethpandaops/ethereum-package --args-file ./network_params.yaml --image-download always

echo "✅ Network started successfully!"
echo ""
echo "🔍 To view network status, run: ./network-status.sh"
echo "🧪 To test the network, run: ./test-network.sh"
echo "🛑 To stop the network, run: ./stop-network.sh"
