#!/bin/bash

# Script to install Kurtosis CLI on Ubuntu/Debian systems
# This script adds the Kurtosis APT repository and installs the CLI

set -e

echo "🚀 Installing Kurtosis CLI..."

# Add Kurtosis APT repository
echo "📦 Adding Kurtosis APT repository..."
echo "deb [trusted=yes] https://apt.fury.io/kurtosis-tech/ /" | sudo tee /etc/apt/sources.list.d/kurtosis.list

# Update package list
echo "🔄 Updating package list..."
sudo apt update

# Install Kurtosis CLI
echo "⬇️  Installing Kurtosis CLI..."
sudo apt install -y kurtosis-cli

# Verify installation
echo "✅ Verifying installation..."
kurtosis version

echo "🎉 Kurtosis CLI installed successfully!"
echo "You can now run 'kurtosis run .' to start your private Ethereum network."
