const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Logger = require('./logHelper');
const fetch = require('node-fetch');
require('dotenv').config();


exports.ethGasStation = async () => {
    const request = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.ETH_GAS_STATION}`);
    const prices = await request.json();

    // Gas Speed can either be one of the below
    // fastest, fast, average, safeLow
    // check https://ethgasstation.info

    const gasLimit = parseInt(bre.shadowConfig.GasLimit);
    const gasPrice = prices[bre.shadowConfig.GasSpeed] / 10;
    const waitTime = prices[`${bre.shadowConfig.GasSpeed}Wait`] * 10; // in minutes
    const txCost = ethers.utils.formatEther((gasLimit * (gasPrice * 1000000000)).toString());

    Logger.txInfo(gasPrice, gasLimit, waitTime, txCost);

    return {
        gasLimit,
        gasPrice: gasPrice * 1000000000
    };
};