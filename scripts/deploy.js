const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Sauce,
    Logger
} = require('./helpers/helper');
require('dotenv').config();

async function main() {

    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractFactory('ShadowGas');

    Logger.talk(`Wallet Balance: ${Sauce.fromEther((await deployer.getBalance()).toString())}`);

    const {
        gasPrice,
        gasLimit
    } = await Sauce.gasInfo();

    const shadowGas = await ShadowGas.deploy({
        gasPrice,
        gasLimit
    });

    await shadowGas.deployed();

    Logger.talk(`Station deployed to: ${shadowGas.address}`);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });