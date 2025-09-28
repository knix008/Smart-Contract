#!/bin/bash

# Start Ethereum Private Network with Kurtosis
# This script starts a private Ethereum network using Kurtosis with block explorers

set -e

echo "🚀 Starting Ethereum Private Network with Kurtosis..."
echo "📊 Including Dora and Blockscout Block Explorers"

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
kurtosis run github.com/ethpandaops/ethereum-package --args-file ./network_params.yaml

# Wait for network to be ready
echo "⏳ Waiting for network to initialize..."
sleep 30

# Get the running enclave name
ENCLAVE_NAME=$(kurtosis enclave ls | grep "RUNNING" | awk '{print $1}' | head -1)

if [ -z "$ENCLAVE_NAME" ]; then
    echo "❌ No running enclave found."
    exit 1
fi

echo "✅ Found running enclave: $ENCLAVE_NAME"

# Start Dora Block Explorer
echo ""
echo "🔍 Starting Dora Block Explorer..."
echo "--------------------------------"

# Check if Dora is already running
if kurtosis service ls $ENCLAVE_NAME | grep -q "dora"; then
    echo "✅ Dora is already running"
else
    echo "🚀 Starting Dora service..."
    kurtosis service add $ENCLAVE_NAME dora ethpandaops/dora:latest --ports dora:4000/tcp:4000
    sleep 15
fi

# Test Dora connection
if curl -s http://127.0.0.1:32826 > /dev/null; then
    echo "✅ Dora Block Explorer is running at: http://127.0.0.1:32826"
    DORA_SUCCESS=true
else
    echo "⚠️  Dora is not yet accessible (may take a few more minutes)"
    DORA_SUCCESS=false
fi

# Start Blockscout Block Explorer
echo ""
echo "🔍 Starting Blockscout Block Explorer..."
echo "--------------------------------------"

# Check if Blockscout services are already running
BLOCKSCOUT_FRONTEND=$(kurtosis service ls $ENCLAVE_NAME | grep "blockscout-frontend" | awk '{print $1}' || echo "")
BLOCKSCOUT_API=$(kurtosis service ls $ENCLAVE_NAME | grep "blockscout-api" | awk '{print $1}' || echo "")

if [ -n "$BLOCKSCOUT_FRONTEND" ] && [ -n "$BLOCKSCOUT_API" ]; then
    echo "✅ Blockscout services are already running"
else
    echo "🚀 Starting Blockscout services..."
    
    # Start Blockscout API first
    if [ -z "$BLOCKSCOUT_API" ]; then
        echo "📡 Starting Blockscout API..."
        kurtosis service add $ENCLAVE_NAME blockscout-api blockscout/blockscout:latest \
            --ports api:4000/tcp:4000 \
            --env-vars MIX_ENV=prod \
            --env-vars DATABASE_URL=postgresql://postgres:postgres@postgres:5432/blockscout \
            --env-vars ETHEREUM_JSONRPC_VARIANT=geth \
            --env-vars ETHEREUM_JSONRPC_HTTP_URL=http://el-1-geth-lighthouse:8545 \
            --env-vars ETHEREUM_JSONRPC_WS_URL=ws://el-1-geth-lighthouse:8546 \
            --env-vars ETHEREUM_JSONRPC_TRACE_URL=http://el-1-geth-lighthouse:8545 \
            --env-vars NETWORK=localhost \
            --env-vars SUBNETWORK=Local \
        sleep 20
    fi
    
    # Start Blockscout Frontend
    if [ -z "$BLOCKSCOUT_FRONTEND" ]; then
        echo "🖥️  Starting Blockscout Frontend..."
        kurtosis service add $ENCLAVE_NAME blockscout-frontend blockscout/blockscout:latest \
            --ports frontend:4000/tcp:4000 \
            --env-vars MIX_ENV=prod \
            --env-vars DATABASE_URL=postgresql://postgres:postgres@postgres:5432/blockscout \
            --env-vars ETHEREUM_JSONRPC_VARIANT=geth \
            --env-vars ETHEREUM_JSONRPC_HTTP_URL=http://el-1-geth-lighthouse:8545 \
            --env-vars ETHEREUM_JSONRPC_WS_URL=ws://el-1-geth-lighthouse:8546 \
            --env-vars ETHEREUM_JSONRPC_TRACE_URL=http://el-1-geth-lighthouse:8545 \
            --env-vars NETWORK=localhost \
            --env-vars SUBNETWORK=Local \
        sleep 30
    fi
fi

# Test Blockscout connections
echo "🔍 Testing Blockscout connections..."
FRONTEND_READY=false
API_READY=false

if curl -s http://127.0.0.1:3000 > /dev/null; then
    FRONTEND_READY=true
    echo "✅ Blockscout Frontend is accessible at: http://127.0.0.1:3000"
else
    echo "⚠️  Blockscout Frontend is not yet accessible"
fi

if curl -s http://127.0.0.1:33002 > /dev/null; then
    API_READY=true
    echo "✅ Blockscout API is accessible at: http://127.0.0.1:33002"
else
    echo "⚠️  Blockscout API is not yet accessible"
fi

# Summary
echo ""
echo "📊 Network and Block Explorers Status"
echo "====================================="

if [ "$DORA_SUCCESS" = true ]; then
    echo "✅ Dora Block Explorer: http://127.0.0.1:32826"
    echo "   - Lightweight beacon chain explorer"
    echo "   - Quick blockchain overview"
else
    echo "⚠️  Dora Block Explorer: Starting up..."
    echo "   - Will be available at: http://127.0.0.1:32826"
fi

if [ "$FRONTEND_READY" = true ] && [ "$API_READY" = true ]; then
    echo "✅ Blockscout Block Explorer:"
    echo "   - Frontend: http://127.0.0.1:3000"
    echo "   - API: http://127.0.0.1:33002"
    echo "   - Full-featured explorer with advanced analytics"
else
    echo "⚠️  Blockscout Block Explorer: Starting up..."
    echo "   - Frontend: http://127.0.0.1:3000"
    echo "   - API: http://127.0.0.1:33002"
fi

echo ""
echo "🌐 Network Access Points:"
echo "   - RPC Node 1: http://127.0.0.1:32775"
echo "   - RPC Node 2: http://127.0.0.1:32780"
echo "   - RPC Node 3: http://127.0.0.1:32785"

echo ""
echo "💡 Useful Commands:"
echo "   - View network status: ./network-status.sh"
echo "   - Test the network: ./test-network.sh"
echo "   - Stop the network: ./stop-network.sh"
echo "   - View service logs: kurtosis service logs $ENCLAVE_NAME <service-name>"

echo ""
echo "🎉 Network started successfully with block explorers!"
echo "📝 Note: Block explorers may take a few minutes to fully initialize."