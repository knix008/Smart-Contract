#!/bin/bash

set -e

echo "======================================"
echo "Installing Kurtosis and Dependencies"
echo "======================================"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "Please do not run this script as root"
    exit 1
fi

# Update package list
echo -e "\n[1/4] Updating package list..."
sudo apt-get update

# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    echo -e "\n[2/4] Installing Docker..."
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    # Set up the stable repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    # Add current user to docker group
    sudo usermod -aG docker $USER
    echo "Docker installed. You may need to log out and back in for group changes to take effect."
else
    echo -e "\n[2/4] Docker is already installed"
fi

# Install Kurtosis
echo -e "\n[3/4] Installing Kurtosis CLI..."
if ! command -v kurtosis &> /dev/null; then
    echo "deb [trusted=yes] https://apt.fury.io/kurtosis-tech/ /" | sudo tee /etc/apt/sources.list.d/kurtosis.list
    sudo apt-get update
    sudo apt-get install -y kurtosis-cli
else
    echo "Kurtosis is already installed. Upgrading to latest version..."
    sudo apt-get update
    sudo apt-get install -y --only-upgrade kurtosis-cli
fi

# Verify installations
echo -e "\n[4/4] Verifying installations..."
docker --version
kurtosis version

echo -e "\n======================================"
echo "Installation Complete!"
echo "======================================"
echo ""
echo "If Docker was just installed, please log out and log back in"
echo "for the group permissions to take effect."
echo ""
echo "To start your private PoS Ethereum network, run:"
echo "  ./start_network.sh"
