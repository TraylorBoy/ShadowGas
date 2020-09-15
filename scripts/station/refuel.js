const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Sauce,
    Logger
} = require('../helpers/helper');
require('dotenv').config();

// Avg tx burns around 20 chi
// Limit is 140 per tx
// Chi uses 0 decimals
const amountToMint = bre.shadowConfig.RefuelAmount * 1;

async function main() {

    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    Logger.talk(`Wallet Balance: ${Sauce.fromEther((await deployer.getBalance()).toString())}`);

    Logger.talk(`Connected to station at: ${ShadowGas.address}`);

    let chiBefore = await Sauce.stationBalance();

    Logger.talk('Refueling...');

    const {
        gasLimit,
        gasPrice
    } = await Sauce.gasInfo();

    // Mints CHI Tokens
    // Stores minted tokens at contract address
    await ShadowGas.refuel(amountToMint, {
        gasLimit,
        gasPrice
    }).then(tx => {

        Logger.talk(`Filled tank with ${amountToMint} chi`);

    }).catch(err => {

        console.err(err);
    });

    // Minting successful?
    let chiAfter = await Sauce.stationBalance();

    if (chiBefore == chiAfter) {
        console.error('Chi Balance did not change, possible out of gas error during transaction. Check etherscan! (Hint) Raise Gas Limit');
    }

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });