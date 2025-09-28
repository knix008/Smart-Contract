#!/bin/bash

# Install Kurtosis and dependencies
# This script installs Kurtosis and required dependencies for Ethereum development

set -e

echo "🔧 Installing Kurtosis and Dependencies"
echo "======================================"

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script is designed for Linux. Please install Kurtosis manually."
    echo "📖 Visit: https://docs.kurtosis.com/install"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    
    # Update package index
    sudo apt-get update
    
    # Install required packages
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up the repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Add user to docker group
    sudo usermod -aG docker $USER
    
    echo "✅ Docker installed successfully!"
    echo "⚠️  Please log out and log back in for Docker group changes to take effect."
else
    echo "✅ Docker is already installed"
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "📦 Installing jq..."
    sudo apt-get update
    sudo apt-get install -y jq
    echo "✅ jq installed successfully!"
else
    echo "✅ jq is already installed"
fi

# Install Kurtosis
if ! command -v kurtosis &> /dev/null; then
    echo "🚀 Installing Kurtosis..."
    
    # Download and install Kurtosis
    curl -fsSL https://docs.kurtosis.com/install-linux.sh | bash
    
    # Add to PATH if not already there
    if ! echo "$PATH" | grep -q "$HOME/.kurtosis/bin"; then
        echo 'export PATH="$HOME/.kurtosis/bin:$PATH"' >> ~/.bashrc
        export PATH="$HOME/.kurtosis/bin:$PATH"
    fi
    
    echo "✅ Kurtosis installed successfully!"
else
    echo "✅ Kurtosis is already installed"
fi

# Verify installations
echo ""
echo "🔍 Verifying installations..."

if command -v docker &> /dev/null; then
    echo "✅ Docker: $(docker --version)"
else
    echo "❌ Docker installation failed"
fi

if command -v jq &> /dev/null; then
    echo "✅ jq: $(jq --version)"
else
    echo "❌ jq installation failed"
fi

if command -v kurtosis &> /dev/null; then
    echo "✅ Kurtosis: $(kurtosis version)"
else
    echo "❌ Kurtosis installation failed"
fi

echo ""
echo "🎉 Installation completed!"
echo ""
echo "📝 Next steps:"
echo "  1. If Docker was just installed, log out and log back in"
echo "  2. Start the network: ./start-network.sh"
echo "  3. Check network status: ./network-status.sh"
echo "  4. Test the network: ./test-network.sh"
