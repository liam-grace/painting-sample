#! /usr/bin/env node

const ContractEventListener = require('fabric-network/lib/impl/event/contracteventlistener');

const results = require('yargs')
    .commandDir('./cmds')
    .demandCommand()
    .help()
    .wrap(null)
    .alias('v', 'version')
    .version('0.0.1')
    .describe('v', 'show version information')
    .argv;

if (typeof(results.thePromise) !== 'undefined') {
    results.thePromise.then((data) => {
        if (!(data instanceof ContractEventListener) && data.constructor.name !== 'ChaincodeRegistration') {
            console.log('\nCommand succeeded\n');

            if (data) {
                console.log('\nOUTPUT:\n' + data.toString() + '\n');
            }

            process.exit(0);
        }
    }).catch((error) => {
        console.log(error + '\nCommand failed\n');
        process.exit(1);
    });
} else {
    process.exit(0);
}
