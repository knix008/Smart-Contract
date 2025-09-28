#!/bin/bash

# Script to check the status of the private PoS Ethereum network

set -e

echo "📊 Private PoS Ethereum Network Status"
echo "======================================"

# Check if Kurtosis CLI is installed
if ! command -v kurtosis &> /dev/null; then
    echo "❌ Kurtosis CLI is not installed."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running."
    exit 1
fi

echo ""
echo "🏠 Running Enclaves:"
kurtosis enclave ls

echo ""
echo "🐳 Docker Containers:"
docker ps --filter "label=kurtosis.enclave" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📋 Network Configuration:"
echo "  - Network ID: 3151908"
echo "  - Chain ID: 3151908"
echo "  - Seconds per slot: 12"
echo "  - Genesis delay: 10 seconds"
echo "  - Number of validators: 64"
echo "  - 3 Geth execution layer nodes"
echo "  - Lighthouse consensus layer nodes"
echo "  - Dora Explorer: http://localhost:3000"
echo "  - Blockscout Explorer: http://localhost:4000"

echo ""
echo "🔗 Useful Commands:"
echo "  - View logs: kurtosis enclave logs <enclave-name>"
echo "  - Connect to node: kurtosis enclave shell <enclave-name> <service-name>"
echo "  - Stop network: ./stop-network.sh"
