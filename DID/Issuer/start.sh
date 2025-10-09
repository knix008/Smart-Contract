#!/bin/bash

# DID Issuer Service Startup Script
# This script starts the DID Issuer service with proper environment setup

echo "🏢 Starting DID Issuer Service..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📂 Working directory: $SCRIPT_DIR${NC}"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Make sure you're in the correct directory.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Copying from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file from template${NC}"
        echo -e "${YELLOW}⚠️  Please configure your .env file with proper values before running the service${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Please create a .env file manually.${NC}"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
fi

# Check if required environment variables are set
echo -e "${BLUE}🔍 Checking environment configuration...${NC}"

# Source the .env file to check variables
set -a
source .env
set +a

# Check critical environment variables
MISSING_VARS=()

if [ -z "$RPC_URL" ]; then
    MISSING_VARS+=("RPC_URL")
fi

if [ -z "$PRIVATE_KEY" ]; then
    MISSING_VARS+=("PRIVATE_KEY")
fi

if [ -z "$DID_REGISTRY_ADDRESS" ]; then
    MISSING_VARS+=("DID_REGISTRY_ADDRESS")
fi

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: The following environment variables are not set:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "${YELLOW}   - $var${NC}"
    done
    echo -e "${YELLOW}   The service will start but blockchain functionality may not work properly.${NC}"
fi

# Display configuration
echo -e "${BLUE}🔧 Configuration:${NC}"
echo -e "   Port: ${PORT:-3002}"
echo -e "   Network: ${NETWORK:-sepolia}"
echo -e "   Environment: ${NODE_ENV:-development}"
echo -e "   Contract: ${DID_REGISTRY_ADDRESS:-Not configured}"

echo ""
echo -e "${GREEN}🚀 Starting DID Issuer Service...${NC}"
echo -e "${BLUE}📱 Web Interface: http://localhost:${PORT:-3002}/web${NC}"
echo -e "${BLUE}📡 API Endpoint: http://localhost:${PORT:-3002}/api${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the service${NC}"
echo "=================================="

# Start the service
if [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    echo -e "${BLUE}🔄 Starting in development mode with auto-reload...${NC}"
    npm run dev
else
    echo -e "${BLUE}🏭 Starting in production mode...${NC}"
    npm start
fi