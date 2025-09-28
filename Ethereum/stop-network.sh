#!/bin/bash

# Script to stop the private PoS Ethereum network

set -e

echo "🛑 Stopping private PoS Ethereum network..."

# Check if Kurtosis CLI is installed
if ! command -v kurtosis &> /dev/null; then
    echo "❌ Kurtosis CLI is not installed."
    exit 1
fi

# List running enclaves
echo "📋 Current running enclaves:"
kurtosis enclave ls

# Get the first enclave name (assuming it's our Ethereum network)
ENCLAVE_NAME=$(kurtosis enclave ls --output json | jq -r '.[0].name' 2>/dev/null || echo "")

if [ -z "$ENCLAVE_NAME" ]; then
    echo "ℹ️  No running enclaves found."
    exit 0
fi

echo "🔄 Stopping enclave: $ENCLAVE_NAME"
kurtosis enclave stop "$ENCLAVE_NAME"

echo "✅ Network stopped successfully!"
