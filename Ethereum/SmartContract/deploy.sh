#!/bin/bash

# MyERC20Token Deployment Script
# This script deploys the ERC20 token to the local Ethereum network

set -e

echo "🚀 MyERC20Token Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the SmartContract directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if network is running
echo "🔍 Checking network status..."
if ! curl -s http://127.0.0.1:32973 > /dev/null; then
    echo "❌ Error: Network is not running. Please start the network first:"
    echo "   cd .. && ./start-network.sh"
    exit 1
fi

echo "✅ Network is running"

# Compile contracts
echo "🔨 Compiling contracts..."
npx hardhat compile

# Deploy contract
echo "📦 Deploying MyERC20Token..."
npx hardhat run scripts/deploy.js --network localhost

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Check the deployment info in the deployments/ directory"
echo "   2. View your contract on the block explorer:"
echo "      - Dora: http://127.0.0.1:32826"
echo "      - Blockscout: http://127.0.0.1:3000"
echo "   3. Interact with your contract using:"
echo "      npx hardhat run scripts/interact.js --network localhost"
echo ""
echo "💡 To interact with a specific contract, set the CONTRACT_ADDRESS environment variable:"
echo "   CONTRACT_ADDRESS=0x1234... npx hardhat run scripts/interact.js --network localhost"
