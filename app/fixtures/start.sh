#!/bin/bash

docker-compose  -f ./docker-compose/docker-compose-tls.yaml down
docker-compose  -f ./docker-compose/docker-compose-tls.yaml up -d

sleep 10
docker exec peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/channel/mychannel.tx --tls --cafile /etc/hyperledger/peerOrg1/tls/ca.crt
# docker exec peer0.org1.example.com peer channel join -o orderer.example.com:7050 -b /etc/hyperledger/base/twoorgs.genesis.block
# docker exec peer0.org2.example.com peer channel join -o orderer.example.com:7050 -b /etc/hyperledger/base/twoorgs.genesis.block

# docker exec peer0.org1.example.com peer chaincode install -n painting-trade -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"
# docker exec peer0.org2.example.com peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n fabcar -l node -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
# sleep 10
# docker exec peer0.org1.example.com peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n fabcar -c '{"function":"instantiate","Args":[]}'
