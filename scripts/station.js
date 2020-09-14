const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Sauce,
    Logger
} = require('./helpers/helper');
require('dotenv').config();

// Choose gas speed dependent on how fast tx should confirm
const useGasSpeed = "fast"; // fastest, fast, average, safeLow

async function main() {

    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    Logger.talk(`Wallet Balance: ${Sauce.fromEther((await deployer.getBalance()).toString())}`);

    Logger.talk(`Connected to station at: ${ShadowGas.address}`);

    // await Sauce.fundStation(0.1, "fast");

    let chiBefore = await ShadowGas.tankAmount();

    Logger.talk(`Tank Amount: ${Sauce.fromEther(chiBefore.toString())}`);

    Logger.talk('Refueling...');

    const {
        gasLimit,
        gasPrice
    } = await Sauce.gasInfo(useGasSpeed);

    // Mints 20 CHI Tokens
    await ShadowGas.refuel(20, {
        gasLimit,
        gasPrice
    });

    await Sauce.sleep(15000);

    Logger.talk('Filled tank with 20 tokens');

    // Minting successful?
    let chiAfter = await ShadowGas.tankAmount();

    Logger.talk(`Tank Amount: ${chiAfter.toString()}`);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });