#!/bin/bash

# Stop Ethereum Private Network
# This script stops all running Kurtosis enclaves

set -e

echo "🛑 Stopping Ethereum Private Network..."

# Get all running enclaves
ENCLAVES=$(kurtosis enclave ls | grep "RUNNING" | awk '{print $2}' 2>/dev/null || echo "")

if [ -z "$ENCLAVES" ]; then
    echo "ℹ️  No running enclaves found."
    exit 0
fi

echo "Found running enclaves:"
echo "$ENCLAVES"
echo ""

# Stop each enclave
for enclave in $ENCLAVES; do
    echo "🛑 Stopping enclave: $enclave"
    kurtosis enclave stop "$enclave"
done

echo "✅ All enclaves stopped successfully!"
