#!/bin/bash

# Script to test the Ethereum network connectivity

echo "Testing Private Ethereum Network..."
echo "=================================="

# Get the current running enclave
ENCLAVE_NAME=$(kurtosis enclave ls | head -2 | tail -1 | awk '{print $2}' 2>/dev/null || echo "")

if [ -z "$ENCLAVE_NAME" ]; then
    echo "❌ No running enclaves found. Please start the network first."
    exit 1
fi

echo "📋 Found running enclave: $ENCLAVE_NAME"
echo ""

# Test each node
nodes=("32801" "32803" "32805")
node_names=("Geth Node 1" "Geth Node 2" "Geth Node 3")

for i in "${!nodes[@]}"; do
    port="${nodes[$i]}"
    name="${node_names[$i]}"
    
    echo "🔍 Testing $name (port $port)..."
    
    # Test network version
    response=$(curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}' \
        http://localhost:$port)
    
    if [[ $response == *"3151908"* ]]; then
        echo "  ✅ Network ID: 3151908"
    else
        echo "  ❌ Network ID test failed"
        continue
    fi
    
    # Test block number
    block_response=$(curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        http://localhost:$port)
    
    if [[ $block_response == *"result"* ]]; then
        block_number=$(echo $block_response | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
        block_decimal=$((16#${block_number:2}))
        echo "  ✅ Latest Block: $block_decimal (0x$block_number)"
    else
        echo "  ❌ Block number test failed"
    fi
    
    echo ""
done

echo "🌐 Network Explorer URLs:"
echo "  - Main Explorer: http://localhost:8080/block-explorer.html"
echo "  - Network Test: http://localhost:8080/network-test.html"
echo ""
echo "🔗 RPC Endpoints for MetaMask/Remix:"
echo "  - Node 1: http://localhost:32801"
echo "  - Node 2: http://localhost:32803"
echo "  - Node 3: http://localhost:32805"
echo ""
echo "✅ Network test complete!"
