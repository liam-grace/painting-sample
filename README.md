## Painting Auction Sample using Hyperledger Fabric 1.4

### Setup
1. `npm install` in both `/app` and `/contract`
2. `npm run build` in `/app`
3. `npm link` in `/app`
4. Deploy the smart contract in `contract` to a local_fabric using the IBM Blockchain vscode extension
5. Export connection details for local_fabric and copy the `wallet` directory and `connection.json` file into `/app/local_fabric`

### Using the app
The application allows you to submit transactions and create chaincode listeners that listen to events.

#### Submitting a transaction

```
event-cli submit -n sellPainting -a "[\"Mona Lisa\"]"
```

#### Creating an event listener
```
event-cli register -n sell-listener -e sell -r false -t client
```
