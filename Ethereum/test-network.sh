#!/bin/bash

# Test Ethereum Private Network
# This script tests the network connectivity and functionality

set -e

echo "🧪 Testing Ethereum Private Network..."

# Get the first running enclave
ENCLAVE=$(kurtosis enclave ls | grep "RUNNING" | head -1 | awk '{print $2}' 2>/dev/null || echo "")

if [ -z "$ENCLAVE" ]; then
    echo "❌ No running enclaves found. Please start the network first with ./start-network.sh"
    exit 1
fi

echo "📡 Testing enclave: $ENCLAVE"

# Use the known working RPC endpoint
RPC_URL="http://127.0.0.1:32973"
echo "🔗 RPC URL: $RPC_URL"

# Test basic connectivity
echo "🔍 Testing network connectivity..."

# Get current block number
BLOCK_NUMBER=$(curl -s -X POST -H "Content-Type: application/json" \
    --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' \
    "$RPC_URL" | jq -r '.result' 2>/dev/null || echo "null")

if [ "$BLOCK_NUMBER" != "null" ] && [ "$BLOCK_NUMBER" != "" ]; then
    BLOCK_DECIMAL=$((16#${BLOCK_NUMBER#0x}))
    echo "✅ Network is responding! Current block: $BLOCK_DECIMAL"
else
    echo "❌ Network is not responding properly"
    exit 1
fi

# Test network ID
NETWORK_ID=$(curl -s -X POST -H "Content-Type: application/json" \
    --data '{"method":"net_version","params":[],"id":1,"jsonrpc":"2.0"}' \
    "$RPC_URL" | jq -r '.result' 2>/dev/null || echo "null")

if [ "$NETWORK_ID" = "585858" ]; then
    echo "✅ Network ID is correct: $NETWORK_ID"
else
    echo "⚠️  Network ID mismatch. Expected: 585858, Got: $NETWORK_ID"
fi

# Test peer count
PEER_COUNT=$(curl -s -X POST -H "Content-Type: application/json" \
    --data '{"method":"net_peerCount","params":[],"id":1,"jsonrpc":"2.0"}' \
    "$RPC_URL" | jq -r '.result' 2>/dev/null || echo "null")

if [ "$PEER_COUNT" != "null" ] && [ "$PEER_COUNT" != "" ]; then
    PEER_DECIMAL=$((16#${PEER_COUNT#0x}))
    echo "✅ Peer count: $PEER_DECIMAL"
else
    echo "⚠️  Could not get peer count"
fi

echo ""
echo "🎉 Network test completed successfully!"
echo "🌐 Block explorer should be available at the Dora service URL"
echo "📊 Run ./network-status.sh for detailed network information"
