import ethers from 'ethers';
import fetch from 'node-fetch';

/* -------------------------------------------------------------------------- */
/*                           Recommended Gas Prices                           */
/* -------------------------------------------------------------------------- */

/*
 * @param speed = Gas Speed to use ("fast", "average", "slow")
 * @param amount = Amount of Gas Tokens that you are minting (buying)
 */

/* ---------------------------- EthGasStation API --------------------------- */

const ethGasStation = async (speed, amount) => {
    const request = await fetch(
        `https://ethgasstation.info/api/ethgasAPI.json?api-key=${process.env.REACT_APP_ETH_GAS_STATION}`
    );

    const prices = await request.json();

    const gasLimit = 39141 + 36224 * amount + 55000;

    if (speed === 'fast') {
        const gasPrice = prices['fast'] / 10;

        const waitTime = prices['fastWait']; // in minutes

        const txCost = ethers.utils.formatEther(
            (gasLimit * (gasPrice * 1000000000)).toString()
        );

        return {
            waitTime,
            txCost,
            gasLimit,
            gasPrice: gasPrice * 1000000000,
        };
    } else if (speed === 'average') {
        const gasPrice = prices['average'] / 10;

        const waitTime = prices['avgWait']; // in minutes

        const txCost = ethers.utils.formatEther(
            (gasLimit * (gasPrice * 1000000000)).toString()
        );

        return {
            waitTime,
            txCost,
            gasLimit,
            gasPrice: gasPrice * 1000000000,
        };
    } else if (speed === 'slow') {
        const gasPrice = prices['safeLow'] / 10;

        const waitTime = prices['safeLowWait']; // in minutes

        const txCost = ethers.utils.formatEther(
            (gasLimit * (gasPrice * 1000000000)).toString()
        );

        return {
            waitTime,
            txCost,
            gasLimit,
            gasPrice: gasPrice * 1000000000,
        };
    }
};

/* ------------------------------ EtherScan Api ----------------------------- */

const etherScan = async (speed, amount) => {
    const request = await fetch(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.REACT_APP_ETHERSCAN}`
    );

    const prices = await request.json();

    const gasLimit = 39141 + 36224 * amount + 55000;

    if (speed === 'fast') {
        const requestWaitTime = await fetch(
            `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${prices
                .result.FastGasPrice * 1000000000}&apikey=${
                process.env.REACT_APP_ETHERSCAN
            }`
        );

        const waitTime = await requestWaitTime.json();

        const time = waitTime.result;

        const txCost = ethers.utils.formatEther(
            (gasLimit * (prices.result.FastGasPrice * 1000000000)).toString()
        );

        return {
            time,
            txCost,
            gasPrice: prices.result.FastGasPrice * 1000000000,
            gasLimit,
        };
    } else if (speed === 'average') {
        const requestWaitTime = await fetch(
            `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${prices
                .result.ProposeGasPrice * 1000000000}&apikey=${
                process.env.REACT_APP_ETHERSCAN
            }`
        );

        const waitTime = await requestWaitTime.json();

        const txCost = ethers.utils.formatEther(
            (gasLimit * (prices.result.ProposeGasPrice * 1000000000)).toString()
        );

        const time = waitTime.result;

        return {
            time,
            txCost,
            gasPrice: prices.result.ProposeGasPrice * 1000000000,
            gasLimit,
        };
    } else if (speed === 'slow') {
        const requestWaitTime = await fetch(
            `https://api.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${prices
                .result.SafeGasPrice * 1000000000}&apikey=${
                process.env.REACT_APP_ETHERSCAN
            }`
        );

        const waitTime = await requestWaitTime.json();

        const time = waitTime.result;

        const txCost = ethers.utils.formatEther(
            (gasLimit * (prices.result.SafeGasPrice * 1000000000)).toString()
        );

        return {
            time,
            txCost,
            gasPrice: prices.result.SafeGasPrice * 1000000000,
            gasLimit,
        };
    }
};

export default {
    ethGasStation,
    etherScan,
};
