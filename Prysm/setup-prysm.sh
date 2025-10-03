#!/bin/bash

# Download Prysm if not available
if [ ! -f "prysm.sh" ]; then
    echo "Downloading Prysm..."
    curl https://raw.githubusercontent.com/prysmaticlabs/prysm/master/prysm.sh --output prysm.sh
    chmod +x prysm.sh
fi

# Generate testnet using prysmctl
echo "Generating genesis state..."
./prysm.sh prysmctl testnet generate-genesis \
    --fork=capella \
    --num-validators=64 \
    --genesis-time-delay=10 \
    --chain-config-file=config.yml \
    --geth-genesis-json-in=genesis.json \
    --geth-genesis-json-out=genesis.json \
    --output-ssz=genesis.ssz

echo "Genesis files created successfully!"
