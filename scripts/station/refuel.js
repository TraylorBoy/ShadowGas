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
const amountToMint = parseInt(bre.shadowConfig.RefuelAmount);

async function main() {

    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    Logger.talk(`Wallet Balance: ${Sauce.fromEther((await deployer.getBalance()).toString())}`);

    Logger.talk(`Connected to station at: ${ShadowGas.address}`);

    Logger.talk(`Refueling Amount: ${amountToMint}`);

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
    }).then(async (tx) => {

        await Sauce.sleep(30000); // wait for confirmation (check etherscan)

        // Minting successful?
        let chiAfter = await Sauce.stationBalance();

        if (chiAfter <= chiBefore) throw new Error('Chi Balance did not change, possible out of gas error during transaction. Check etherscan! (Hint) Raise Gas Limit');

        Logger.talk(`Filled tank with ${amountToMint} chi`);

    }).catch(err => {

        console.error(err.message);

    });

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });