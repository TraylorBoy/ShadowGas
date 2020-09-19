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

    timer.start('refuelLgt');

    if (await Store.refuelLgt(parseInt(bre.shadowConfig.RefuelLgtAmt))) {

        const result = timer.stop('refuelLgt');

        Logger.talk(`Refueled in ${result.time} milliseconds`);
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });