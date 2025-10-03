#!/bin/bash

# Start geth execution client
geth \
  --datadir=node1/geth \
  --networkid=32382 \
  --http \
  --http.api=eth,net,web3,engine,admin \
  --http.addr=0.0.0.0 \
  --http.port=8545 \
  --http.corsdomain="*" \
  --ws \
  --ws.api=eth,net,web3,engine,admin \
  --ws.addr=0.0.0.0 \
  --ws.port=8546 \
  --authrpc.addr=localhost \
  --authrpc.port=8551 \
  --authrpc.vhosts=localhost \
  --authrpc.jwtsecret=jwt/jwt.hex \
  --port=30303 \
  --discovery.port=30303 \
  --syncmode=full \
  --allow-insecure-unlock \
  --nodiscover
