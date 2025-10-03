#!/bin/bash

# Create validator keys using prysmctl
echo "Creating validator keys..."

# Generate deterministic validator keys (for testing only)
# Using index 0 will generate keys for the first validator from genesis
./prysmctl validator generate-keys \
  --num-validators=1 \
  --output-path=validator_keys \
  --keymanager-kind=derived

echo "Validator keys created in validator_keys/"
ls -la validator_keys/
