#!/bin/bash

# Start Prysm beacon chain (consensus client)
./prysm.sh beacon-chain \
  --datadir=node1/consensus \
  --min-sync-peers=0 \
  --genesis-state=genesis.ssz \
  --bootstrap-node= \
  --interop-eth1data-votes \
  --chain-config-file=config.yml \
  --contract-deployment-block=0 \
  --chain-id=32382 \
  --execution-endpoint=http://localhost:8551 \
  --accept-terms-of-use \
  --jwt-secret=jwt/jwt.hex \
  --suggested-fee-recipient=0x123463a4b065722e99115d6c222f267d9cabb524 \
  --rpc-host=0.0.0.0 \
  --grpc-gateway-host=0.0.0.0 \
  --force-clear-db
