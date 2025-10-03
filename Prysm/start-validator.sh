#!/bin/bash

# Start Prysm validator with interop keys
# These are deterministic keys generated from the genesis
./prysm.sh validator \
  --datadir=node1/validator \
  --accept-terms-of-use \
  --beacon-rpc-provider=localhost:4000 \
  --interop-num-validators=64 \
  --interop-start-index=0 \
  --chain-config-file=config.yml \
  --force-clear-db
