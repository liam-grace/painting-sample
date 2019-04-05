import * as fs from 'fs-extra';
import * as path from 'path';
import { Argv } from 'yargs';
import { Gateway, FileSystemWallet } from 'fabric-network';
import { submitTransaction } from '../submittransaction';
import { createContractListener, createBaseContractListener } from '../createcontractlistener';

const wallet = new FileSystemWallet('./local_fabric/wallet');
const ccpLocation = path.join(__dirname, '../../local_fabric/connection.json');

export const command = 'register [options]';
export const desc = '';
export const builder = (yargs: Argv) => {
    yargs.options({
        eventName: {
            alias: 'e',
            required: true,
            type: 'string',
        },
        listenerName: {
            alias: 'n',
            required: true,
            type: 'string',
        },
        replay: {
            alias: 'r',
            default: false,
            required: false,
            type: 'boolean',
        },
        type: {
            alias: 't',
            default: 'client',
            required: false,
            type: 'string'
        }
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
        let count = 0;
        const contract = network.getContract('contract');
        if (argv.type === 'network') {
            return createContractListener(contract, argv.listenerName, argv.eventName, (err, ...args) => {
                if (!err) {
                    console.clear();
                    console.log(args);
                    console.log(++count);
                }
            }, {replay: argv.replay});
        } else if (argv.type === 'client') {
            return createBaseContractListener(contract, argv.listenerName, argv.eventName, (err, ...args) => {
                if (!err) {
                    console.clear();
                    console.log(args);
                    console.log(++count);
                }
            }, {replay: argv.replay});
        }
    });
};
