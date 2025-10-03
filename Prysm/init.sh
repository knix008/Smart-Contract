#!/bin/bash

# Initialize geth with genesis
echo "Initializing geth node..."
geth init --datadir=node1/geth genesis.json

echo "Initialization complete!"
