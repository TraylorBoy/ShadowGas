const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Trade,
    Logger,
    Sleep
} = require('../helpers/helper');
require('dotenv').config();

const timer = require('execution-time')();

async function main() {

    timer.start('arbitrageLgt');

    while (Trade.TRADER.TradeCount < Trade.TRADER.TradeLimit) {

        await Trade.lgtArb();

        await Sleep(60000);

    }

    Logger.talk('***********************');
    Logger.talk('Trader Finished');

    Trade.TRADER.Log();

    const result = (timer.stop('arbitrageLgt').time / 1000).toFixed(0);

    Logger.talk(`Traded for ${result} seconds`);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });