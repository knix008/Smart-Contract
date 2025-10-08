#!/bin/bash

# DID System Startup Script
# This script starts all components of the DID system

echo "🚀 Starting DID System Components..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to start a service
start_service() {
    local service_name=$1
    local service_dir=$2
    local port=$3
    
    echo -e "${BLUE}Starting $service_name service...${NC}"
    
    if ! check_port $port; then
        echo -e "${YELLOW}$service_name may already be running on port $port${NC}"
        return 1
    fi
    
    cd $service_dir
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies for $service_name...${NC}"
        npm install
    fi
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            echo -e "${YELLOW}Creating .env file for $service_name from .env.example${NC}"
            cp .env.example .env
        else
            echo -e "${RED}No .env.example found for $service_name${NC}"
        fi
    fi
    
    echo -e "${GREEN}Starting $service_name on port $port...${NC}"
    npm start &
    
    cd - > /dev/null
}

# Check if we're in the right directory
if [ ! -d "SmartContracts" ] || [ ! -d "Wallet" ] || [ ! -d "Issuer" ] || [ ! -d "Verifier" ]; then
    echo -e "${RED}Error: Please run this script from the DID project root directory${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}Starting DID System...${NC}"
echo ""

# Start services
start_service "Wallet" "Wallet" 3001
sleep 2

start_service "Issuer" "Issuer" 3002
sleep 2

start_service "Verifier" "Verifier" 3003
sleep 2

echo ""
echo -e "${GREEN}🎉 All services started!${NC}"
echo ""
echo -e "${BLUE}Service URLs:${NC}"
echo "💼 Wallet Service:    http://localhost:3001"
echo "🏢 Issuer Service:    http://localhost:3002"
echo "🔍 Verifier Service:  http://localhost:3003"
echo ""
echo -e "${BLUE}Health Check URLs:${NC}"
echo "💼 Wallet Health:     http://localhost:3001/health"
echo "🏢 Issuer Health:     http://localhost:3002/health"
echo "🔍 Verifier Health:   http://localhost:3003/health"
echo ""
echo -e "${YELLOW}To run integration tests:${NC}"
echo "cd scripts && npm install && npm test"
echo ""
echo -e "${YELLOW}To stop all services, press Ctrl+C${NC}"

# Wait for user interrupt
wait