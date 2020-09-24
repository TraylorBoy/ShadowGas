const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Oracle,
    Logger
} = require('../helpers/helper');
require('dotenv').config();

const timer = require('execution-time')();

async function main() {

    timer.start('oracleLgt');

    await Oracle.LGT_TRADE.Update();

    const result = (timer.stop('oracleLgt').time / 1000).toFixed(0);

    Logger.talk(`Updated trade information in ${result} seconds`);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });