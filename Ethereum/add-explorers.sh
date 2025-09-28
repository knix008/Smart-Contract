#!/bin/bash

# Script to start block explorer web server for the running Ethereum network

set -e

echo "Starting block explorer web server..."

# Check if Kurtosis CLI is installed
if ! command -v kurtosis &> /dev/null; then
    echo "Kurtosis CLI is not installed."
    exit 1
fi

# Get the current running enclave
ENCLAVE_NAME=$(kurtosis enclave ls | head -2 | tail -1 | awk '{print $2}' 2>/dev/null || echo "")

if [ -z "$ENCLAVE_NAME" ]; then
    echo "No running enclaves found. Please start the network first with './start-network.sh'"
    exit 1
fi

echo "Found running enclave: $ENCLAVE_NAME"

# Check if block-explorer.html exists
if [ ! -f "block-explorer.html" ]; then
    echo "block-explorer.html not found in current directory"
    exit 1
fi

# Kill any existing HTTP servers
pkill -f "python3 -m http.server 8080" 2>/dev/null || true
pkill -f "python3 api-server.py" 2>/dev/null || true

# Start API server in the background
echo "Starting API server on port 8082..."
cd /home/shkwon/Projects/Smart-Contract/Ethereum
chmod +x api-server.py
python3 api-server.py &

# Start HTTP server in the background
echo "Starting HTTP server on port 8080..."
python3 -m http.server 8080 &

# Wait a moment for server to start
sleep 2

echo "Block explorer is now available at: http://localhost:8080/block-explorer.html"
echo ""
echo "Current network endpoints:"
echo "  - geth-1: http://localhost:32801"
echo "  - geth-2: http://localhost:32803" 
echo "  - geth-3: http://localhost:32805"
echo ""
echo "To stop the web servers, run:"
echo "  pkill -f 'python3 -m http.server 8080'"
echo "  pkill -f 'python3 api-server.py'"