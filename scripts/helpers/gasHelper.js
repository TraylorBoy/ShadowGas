const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Logger = require('./logHelper');
const fetch = require('node-fetch');
require('dotenv').config();


exports.ethGasStation = async () => {

    Logger.talk('Fetching EthGasStation prices');

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

exports.etherScan = async () => {

    Logger.talk('Fetching EtherScan prices');

    const request = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN}`);

    const prices = await request.json();
    const gasLimit = parseInt(bre.shadowConfig.GasLimit);

    if (bre.shadowConfig.GasSpeed == 'fast') {

        const requestWaitTime = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${prices.result.FastGasPrice * 1000000000}&apikey=${process.env.ETHERSCAN}`);

        const waitTime = await requestWaitTime.json();

        const txCost = ethers.utils.formatEther((gasLimit * (prices.result.FastGasPrice * 1000000000)).toString());

        Logger.txInfo(prices.result.FastGasPrice, gasLimit, parseInt(waitTime.result) / 60, txCost);

        return {
            gasPrice: prices.result.FastGasPrice * 1000000000,
            gasLimit
        };

    } else if (bre.shadowConfig.GasSpeed == 'average') {

        const requestWaitTime = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${prices.result.ProposeGasPrice * 1000000000}&apikey=${process.env.ETHERSCAN}`);

        const waitTime = await requestWaitTime.json();

        const txCost = ethers.utils.formatEther((gasLimit * (prices.result.ProposeGasPrice * 1000000000)).toString());

        Logger.txInfo(prices.result.ProposeGasPrice, gasLimit, parseInt(waitTime.result) / 60, txCost);

        return {
            gasPrice: prices.result.ProposeGasPrice * 1000000000,
            gasLimit
        };

    } else if (bre.shadowConfig.GasSpeed == 'slow') {

        const requestWaitTime = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${prices.result.SafeGasPrice * 1000000000}&apikey=${process.env.ETHERSCAN}`);


        const waitTime = await requestWaitTime.json();

        const txCost = ethers.utils.formatEther((gasLimit * (prices.result.SafeGasPrice * 1000000000)).toString());

        Logger.txInfo(prices.result.SafeGasPrice, gasLimit, parseInt(waitTime.result) / 60, txCost);

        return {
            gasPrice: prices.result.SafeGasPrice * 1000000000,
            gasLimit

        };

    }


};