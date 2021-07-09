This directory will contains docker-compose files for ethereum private network.
1. Download Gethnodes.zip file.
2. Install docker.
3. Unzip Gethnodes.zip file. There is node1, node2, node3 folder.
4. Make geth docker image using "docker build -t geth" command.
5. Install docker-compose.
6. Run "docker-compose up" command to see the 3 nodes private ethereum network.
7. Install truffle.
8. Run "truffle unbox metacoin" command.
9. Go to metacoin directory.
10. Check "truffle-config.js" file to include "127.0.0.1" and "8545"  for contract migration.
11. Run "truffle migrate" command to deploy smart contract.
12. Then... enjoy!!!
