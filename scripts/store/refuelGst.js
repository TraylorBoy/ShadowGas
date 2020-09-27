const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Logger,
    Store
} = require('../helpers/helper');

const timer = require('execution-time')();

async function main() {

    timer.start('refuelGst');

    if (await Store.refuelGst(bre.shadowConfig.RefuelGstAmt)) {

        const result = (timer.stop('refuelGst').time / 1000).toFixed(0);

        Logger.talk(`Refueled in ${result} seconds`);
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });