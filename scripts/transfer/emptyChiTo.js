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

    timer.start('emptyChiTo');

    if (await Transfer.emptyChiTankTo(parseInt(bre.shadowConfig.EmptyChiAmt), bre.shadowConfig.EmptyChiTo)) {

        const result = (timer.stop('emptyChiTo').time / 1000).toFixed(0);

        Logger.talk(`Emptied in ${result} seconds`);

    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });