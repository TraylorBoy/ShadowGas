import ethers from 'ethers';

import Gas from './gas';

/* -------------------------------------------------------------------------- */
/*                               LGT Trade Oracle                             */
/* -------------------------------------------------------------------------- */

const Oracle = {
    GasLimitForTrade: 0, // GasLimit
    GasPriceForTrade: 0, // GasPrice
    GasCostForTrade: 0, // TotalCostToMint BuyAmount
    WaitTimeForTrade: 0, // Expected wait time in seconds for transaction
    TradeToken: '', // Token symbol to trade (only supports LGT currently)
    BuyAmount: 0, // Amount of TradeToken to mint
    ExpectedProfit: 0, // Expected profit if trade were executed
    Profitable: false, // Returns true if ExpectedProfit > GasCostForTrade
    Log: {
        // Log variables
        GasPrice: '',
        GasCost: '',
        WaitTime: '',
        Profit: '',
        Buy: '',
        Opportunity: '',
    },
    TradeFound: async () => {
        await _update();
        return Oracle.Profitable;
    },
    Update: async (shadow, _amountToBuy = '1') => {
        return await _update(shadow, _amountToBuy, 'LGT');
    },
    Log: async () => {
        console.log(Oracle.Log.Buy);
        console.log(Oracle.Log.GasPrice);
        console.log(Oracle.Log.GasCost);
        console.log(Oracle.Log.WaitTime);
        console.log(Oracle.Log.Profit);
        console.log(Oracle.Log.Opportunity);
    },
    getReadable: () => {
        return Oracle.Log;
    },
};

/* --------------------- Update Trade information --------------------- */
const _setLog = () => {
    Oracle.Log.Buy = `Amount of token to mint is ${Oracle.BuyAmount} ${Oracle.TradeToken}`;
    Oracle.Log.GasPrice = `Setting gas price for trade to ${Oracle.GasPriceForTrade /
        1000000000} gwei`;
    Oracle.Log.GasCost = `Gas cost for minting ${Oracle.BuyAmount} ${
        Oracle.TradeToken
    } is ${ethers.utils.formatEther(Oracle.GasCostForTrade.toString())} eth`;
    Oracle.Log.WaitTime = `Wait time for trade is expected to be less than ${Oracle.WaitTimeForTrade} minutes`;
    Oracle.Log.Profit = `Expected profit for trade is ${ethers.utils.formatEther(
        Oracle.ExpectedProfit.toString()
    )} eth`;
    Oracle.Profitable
        ? (Oracle.Log.Opportunity = 'Trade opportunity found')
        : (Oracle.Log.Opportunity = `Trade not profitable`);
};

const _update = async (shadow, amountTobuy, tokenName) => {
    Oracle.BuyAmount = parseInt(amountTobuy);
    Oracle.TradeToken = tokenName;

    const { gasLimit, gasPrice, txCost, time } = await Gas.etherScan(
        'slow',
        Oracle.BuyAmount
    );

    Oracle.WaitTimeForTrade = (parseInt(time) / 60).toFixed(2);
    Oracle.GasLimitForTrade = (39141 + 36224 + 55000) * Oracle.BuyAmount; // (costToMint(1) + overHead) * amountToBuy
    Oracle.GasPriceForTrade = gasPrice;

    const tradeInfo = await shadow.lgtTradeInfo(Oracle.BuyAmount, {
        gasLimit: Oracle.GasLimitForTrade,
        gasPrice: Oracle.GasPriceForTrade,
    });

    Oracle.GasCostForTrade = tradeInfo[1]; // Total cost in wei
    Oracle.ExpectedProfit = tradeInfo[0]; // Profit in wei
    Oracle.Profitable = tradeInfo[2]; // True/False

    // Update readable trade info
    _setLog();

    await Oracle.Log(); // Log trade info

    return Oracle;
};

export default Oracle;
