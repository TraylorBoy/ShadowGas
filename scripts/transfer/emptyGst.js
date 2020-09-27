const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Transfer,
    Logger
} = require('../helpers/helper');
const timer = require('execution-time')();

async function main() {

    timer.start('emptyGst');

    if (await Transfer.emptyGstTank(bre.shadowConfig.EmptyGstAmt)) {

        const result = (timer.stop('emptyGst').time / 1000).toFixed(0);

        Logger.talk(`Emptied in ${result} seconds`);

    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });