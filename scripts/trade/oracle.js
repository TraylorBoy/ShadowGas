const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    GasHelper,
    Logger
} = require('../helpers/helper');
require('dotenv').config();

async function main() {

    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    Logger.talk(`Wallet Balance: ${ethers.utils.formatEther((await deployer.getBalance()).toString())}`);

    const ethGasStation = await GasHelper.ethGasStation();

    const etherScan = await GasHelper.etherScan();

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });