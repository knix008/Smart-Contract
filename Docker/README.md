# This folder will contain all necessary files for "Ethereum private network installation". 
- Dockerfile
- Docker-compose files
- Genesis.json
- Geth Help
- Others.

- If you want to use volume control in docker, you need to use "Dockerfile-volume and docker-compose-twonode-volume.yml" for docker build and docker-compose. 
- Before you run the docker-compose command for the first time, you need to initialize the geth data directory with "geth init" command. 
- Next time you don't need to do it.
- If you want to use "clique" PoA for private network, use puppeth and make new account at leat one for gensis.json file. It is mandatory. If you don't make any account, you will meet a crash.
