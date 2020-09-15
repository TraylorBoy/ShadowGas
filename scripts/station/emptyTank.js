const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    Sauce,
    Logger
} = require('../helpers/helper');
require('dotenv').config();

const amountToWithdraw = parseInt(bre.shadowConfig.WithdrawAmount);

async function main() {

    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    Logger.talk(`Wallet Balance: ${Sauce.fromEther((await deployer.getBalance()).toString())}`);

    Logger.talk(`Connected to station at: ${ShadowGas.address}`);

    const chiBefore = await Sauce.stationBalance();

    if (chiBefore == 0.0) return;

    Logger.talk(`Emptying tank amount: ${chiBefore}`);

    const {
        gasLimit,
        gasPrice
    } = await Sauce.gasInfo();

    await ShadowGas.emptyTank(amountToWithdraw, {
        gasLimit,
        gasPrice
    }).then(async (tx) => {

        await Sauce.sleep(15000); // wait for confirmation (check etherscan)

        const chiAfter = await Sauce.stationBalance();

        // Withdraw successful?
        if (chiAfter == chiBefore) throw new Error('Emptying tank unsuccessful, check etherscan (tx might not have confirmed yet');

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