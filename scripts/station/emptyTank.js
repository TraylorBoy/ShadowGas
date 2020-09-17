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

    if (chiBefore == 0.0 || chiBefore < amountToWithdraw) return;

    let highestBoughtAt = 0;
    let price = [];
    let amount = [];

    if (chiBefore != amountToWithdraw) {

        const history = await ShadowGas.getFullHistory();

        price = history[0];
        amount = history[1];

        Logger.purchaseHistory(price, amount);

        highestBoughtAt = 0;

        for (let i = 0; i < price.length; i++) {

            if (amount[i] >= amountToWithdraw) highestBoughtAt = i;
        }

        Logger.talk(`Emptying ${amountToWithdraw} chi at ${price[highestBoughtAt] / 1000000000}`);
    } else {
        Logger.talk(`Emptying station for ${amountToWithdraw} chi`);
    }


    const {
        gasLimit,
        gasPrice
    } = await Sauce.gasInfo();

    await ShadowGas.emptyTank(amountToWithdraw, highestBoughtAt, {
        gasLimit,
        gasPrice
    }).then(async (tx) => {

        await Sauce.sleep(30000); // wait for confirmation (check etherscan)

        const chiAfter = await Sauce.stationBalance();

        // Withdraw successful?
        if (chiAfter >= chiBefore) throw new Error('Emptying tank unsuccessful, check etherscan (tx might not have confirmed yet)');

        Logger.talk(`Emptied tank for ${amountToWithdraw} chi`);

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