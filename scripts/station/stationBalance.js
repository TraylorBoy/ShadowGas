const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Sauce,
    Logger
} = require('../helpers/helper');
require('dotenv').config();

async function main() {

    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    Logger.talk(`Wallet Balance: ${Sauce.fromEther((await deployer.getBalance()).toString())}`);

    Logger.talk(`Connected to station at: ${ShadowGas.address}`);

    await Sauce.stationBalance();

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });