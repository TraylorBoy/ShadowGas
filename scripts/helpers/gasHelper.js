const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Logger = require('./logHelper');
const GasToken = require('./gasToken');
const Store = require('./storeHelper');
const fetch = require('node-fetch');
const uniswap = require('@uniswap/sdk');
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

exports.uniswapv2ChiPrice = async () => {

    const CHI = new uniswap.Token(uniswap.ChainId.MAINNET, GasToken.chi.address, GasToken.chi.decimals);

    const pair = await uniswap.Fetcher.fetchPairData(CHI, uniswap.WETH[CHI.chainId]);

    const route = new uniswap.Route([pair], uniswap.WETH[CHI.chainId]);

    return route.midPrice.invert().toSignificant(6);

};

/* -------------------------------------------------------------------------- */
// TODO: Make a separate helper (tradeHelper.js)
/*
    LGT TRADE
*/

exports.lgtTradeOpportunity = async () => {

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    const {
        gasPrice
    } = await this.etherScan();

    const tradeInfo = await ShadowGas.lgtTradeInfo(parseInt(bre.shadowConfig.LgtTradeAmt), {
        gasLimit: 500000,
        gasPrice
    });

    Logger.talk('LGT Trade Info');
    Logger.talk(`Profit: ${ethers.utils.formatEther(tradeInfo[0].toString())}`);
    Logger.talk(`Gas Cost: ${ethers.utils.formatEther(tradeInfo[1].toString())}`);
    Logger.talk(`Is Profitable: ${tradeInfo[2]}`);

    return {
        gasCost: tradeInfo[1],
        isProfitable: tradeInfo[2],
        gasPrice
    };

};

exports.lgtArb = async () => {

    const trade = await this.lgtTradeOpportunity();

    if (trade.isProfitable) {

        Logger.talk('Initiating trade');

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        const balanceBefore = await Store.walletBalance();

        await ShadowGas.lgtArb(parseInt(bre.shadowConfig.LgtTradeAmt), {
            gasLimit: 500000,
            gasPrice: trade.gasPrice,
            value: trade.gasCost
        }).then(async (tx) => {

            Logger.talk('Waiting for transaction to finish');
            await tx.wait();

        });

        const balanceAfter = await Store.walletBalance();

        Logger.talk(`Profit: ${balanceAfter - balanceBefore}`);

    }

};