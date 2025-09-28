#!/bin/bash

# Network Status Monitor
# This script shows the status of the Ethereum private network

set -e

echo "📊 Ethereum Private Network Status"
echo "=================================="

# Check if Kurtosis is installed
if ! command -v kurtosis &> /dev/null; then
    echo "❌ Kurtosis is not installed"
    exit 1
fi

# List all enclaves
echo ""
echo "🏠 Enclaves:"
kurtosis enclave ls

# Get running enclaves
RUNNING_ENCLAVES=$(kurtosis enclave ls | grep "RUNNING" | awk '{print $2}' 2>/dev/null || echo "")

if [ -z "$RUNNING_ENCLAVES" ]; then
    echo ""
    echo "ℹ️  No running enclaves found."
    echo "🚀 Start the network with: ./start-network.sh"
    exit 0
fi

echo ""
echo "🟢 Running Enclaves:"
for enclave in $RUNNING_ENCLAVES; do
    echo "  - $enclave"
done

# Get details for the first running enclave
ENCLAVE=$(echo "$RUNNING_ENCLAVES" | head -1)
echo ""
echo "🔍 Details for enclave: $ENCLAVE"

# Show services
echo ""
echo "🛠️  Services:"
kurtosis service ls "$ENCLAVE"

# Get RPC endpoints
echo ""
echo "🔗 RPC Endpoints:"
RPC_ENDPOINTS="http://127.0.0.1:32973"

if [ -n "$RPC_ENDPOINTS" ]; then
    echo "  - Geth Node 1: $RPC_ENDPOINTS"
    
    # Test connectivity
    echo ""
    echo "🧪 Testing connectivity..."
    
    # Get current block
    BLOCK_NUMBER=$(curl -s -X POST -H "Content-Type: application/json" \
        --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' \
        "$RPC_ENDPOINTS" | jq -r '.result' 2>/dev/null || echo "null")
    
    if [ "$BLOCK_NUMBER" != "null" ] && [ "$BLOCK_NUMBER" != "" ]; then
        BLOCK_DECIMAL=$((16#${BLOCK_NUMBER#0x}))
        echo "  ✅ Current block: $BLOCK_DECIMAL"
    else
        echo "  ❌ Network not responding"
    fi
    
    # Get network ID
    NETWORK_ID=$(curl -s -X POST -H "Content-Type: application/json" \
        --data '{"method":"net_version","params":[],"id":1,"jsonrpc":"2.0"}' \
        "$RPC_ENDPOINTS" | jq -r '.result' 2>/dev/null || echo "null")
    
    if [ "$NETWORK_ID" != "null" ]; then
        echo "  📡 Network ID: $NETWORK_ID"
    fi
    
    # Get peer count
    PEER_COUNT=$(curl -s -X POST -H "Content-Type: application/json" \
        --data '{"method":"net_peerCount","params":[],"id":1,"jsonrpc":"2.0"}' \
        "$RPC_ENDPOINTS" | jq -r '.result' 2>/dev/null || echo "null")
    
    if [ "$PEER_COUNT" != "null" ] && [ "$PEER_COUNT" != "" ]; then
        PEER_DECIMAL=$((16#${PEER_COUNT#0x}))
        echo "  👥 Peer count: $PEER_DECIMAL"
    fi
else
    echo "  ❌ No RPC endpoints found"
fi

# Check for Dora block explorer
echo ""
echo "🔍 Block Explorer:"
DORA_URL="http://127.0.0.1:32999"

if [ -n "$DORA_URL" ]; then
    echo "  🌐 Dora Explorer: $DORA_URL"
else
    echo "  ❌ Dora block explorer not found"
fi

echo ""
echo "📝 Useful commands:"
echo "  🧪 Test network: ./test-network.sh"
echo "  🛑 Stop network: ./stop-network.sh"
echo "  📊 View logs: kurtosis service logs $ENCLAVE <service-name>"
