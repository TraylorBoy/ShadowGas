const bre = require('@nomiclabs/buidler');
const { ethers } = require('ethers');
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

exports.gasInfo = async (type) => {
    const request = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.ETH_GAS_STATION}`);
    const prices = await request.json();

    const gasLimit = 1000000;
    const gasPrice = prices[type] / 10;
    const waitTime = prices[`${type}Wait`] * 10; // in minutes
    const txCost = this.fromEther((gasLimit * (gasPrice * 1000000000)).toString());

    Logger.txInfo(gasPrice, gasLimit, waitTime, txCost);

    return {
        gasLimit,
        gasPrice: gasPrice * 1000000000
    };
};

// TODO: Get contract balance
exports.fundStation = async (amt, gasType) => {

    Logger.talk(`Will Fund station with: ${amt} eth`);
    
    const { gasLimit, gasPrice } = await this.gasInfo(gasType);

    [deployer] = await bre.ethers.getSigners();

    Logger.talk(`Sending funds to station...`);

    await deployer.sendTransaction({
        to: process.env.SHADOWGAS,
        from: process.env.WALLET,
        value: this.toEther(amt.toString()),
        gasLimit,
        gasPrice
    });

    Logger.talk('Funds transferred');
    
};
