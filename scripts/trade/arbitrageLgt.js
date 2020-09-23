const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    GasHelper,
    Logger,
    Sleep
} = require('../helpers/helper');
require('dotenv').config();

async function main() {
    while (true) {


        await GasHelper.lgtArb();

        await Sleep(60000);

    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });