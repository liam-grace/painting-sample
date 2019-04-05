import * as fs from 'fs-extra';
import * as path from 'path';
import { Argv } from 'yargs';
import { Gateway, FileSystemWallet } from 'fabric-network';
import { submitTransaction } from '../submittransaction';

const wallet = new FileSystemWallet('./local_fabric/wallet');
const ccpLocation = path.join(__dirname, '../../local_fabric/connection.json');

export const command = 'submit [options]';
export const desc = '';
export const builder = (yargs: Argv) => {
    yargs.options({
        args: {
            alias: 'a',
            required: true,
            type: 'string',
        },
        transactionName: {
            alias: 'n',
            required: true ,
            type: 'string',
        },
    });
    return yargs;
};

export const handler = async (argv: any) => {
    const ccpBuffer = fs.readFileSync(ccpLocation);
    const ccp = JSON.parse(ccpBuffer.toString('utf8'));

    const gateway = new Gateway();
    return argv.thePromise = gateway.connect(ccp, {
        discovery: {enabled: false},
        identity: 'Admin@org1.example.com',
        wallet,
    })
    .then(() => {
        return gateway.getNetwork('mychannel');
    })
    .then((network) => {
        const contract = network.getContract('contract');
        const args = JSON.parse(argv.args);
        return submitTransaction(contract, argv.transactionName, args);
    });
};
