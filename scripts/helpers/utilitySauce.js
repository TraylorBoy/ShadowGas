const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const fetch = require('node-fetch');
const Logger = require('./logging');
require('dotenv').config();

exports.toEther = ethers.utils.parseEther;
exports.fromEther = ethers.utils.formatEther;

exports.sleep = async (len) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, len);
    });
};

exports.gasInfo = async () => {
    const request = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.ETH_GAS_STATION}`);
    const prices = await request.json();

    // Gas Speed can either be one of the below
    // fastest, fast, average, safeLow
    // check https://ethgasstation.info

    const gasLimit = parseInt(bre.shadowConfig.GasLimit);
    const gasPrice = prices[bre.shadowConfig.GasSpeed] / 10;
    const waitTime = prices[`${bre.shadowConfig.GasSpeed}Wait`] * 10; // in minutes
    const txCost = this.fromEther((gasLimit * (gasPrice * 1000000000)).toString());

    Logger.txInfo(gasPrice, gasLimit, waitTime, txCost);

    return {
        gasLimit,
        gasPrice: gasPrice * 1000000000
    };
};

exports.stationBalance = async () => {

    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    const tankAmount = await ShadowGas.tankAmount();

    if (tankAmount > 0) Logger.talk(`Station stocked at: ${tankAmount} Chi`);
    else Logger.talk(`Station empty`);

    return tankAmount;

};

exports.walletBalance = async () => {
    [deployer] = await bre.ethers.getSigners();

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    const bal = this.fromEther((await deployer.getBalance()).toString());

    Logger.talk(`Wallet Balance: ${bal}`);

    return bal;
};