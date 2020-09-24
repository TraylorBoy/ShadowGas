const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Logger = require('./logHelper');
const Store = require('./storeHelper');
const Oracle = require('./oracleHelper');
require('dotenv').config();

exports.TRADER = {
    TradeLimit: 3,
    TradeCount: 0,
    TotalProfit: 0,
    Log: () => {

        Logger.talk(`Total Profit: ${this.TRADER.TotalProfit}`);

    }
};

exports.TRADE = {
    TradeNumber: 0,
    Profit: 0,
    Log: () => {
        Logger.talk(`Trade Finished`);
        Logger.talk(`Trade: ${this.TRADE.TradeNumber}`);
        Logger.talk(`Profit: ${this.TRADE.Profit}`);
    }
};

exports.lgtArb = async () => {

    if (await Oracle.LGT_TRADE.TradeFound()) {

        Logger.talk('Initiating trade');

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        const balanceBefore = await Store.walletBalance();

        await ShadowGas.lgtArb(Oracle.LGT_TRADE.BuyAmount, {
            gasLimit: Oracle.LGT_TRADE.GasLimitForTrade,
            gasPrice: Oracle.LGT_TRADE.GasPriceForTrade,
            value: Oracle.LGT_TRADE.GasCostForTrade
        }).then(async (tx) => {

            Logger.talk('Waiting for transaction to finish');
            await tx.wait();

        });

        const balanceAfter = await Store.walletBalance();

        this.TRADER.TradeCount++;

        this.TRADE.TradeNumber = this.TRADER.TradeCount;
        this.TRADE.Profit = balanceAfter - balanceBefore;

        this.TRADER.TotalProfit += this.TRADE.Profit;

        this.TRADE.Log();

    }

};

exports.chiArb = async () => {

    if (await Oracle.CHI_TRADE.TradeFound()) {

        Logger.talk('Initiating trade');

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        const balanceBefore = await Store.walletBalance();

        await ShadowGas.chiArb(Oracle.CHI_TRADE.BuyAmount, {
            gasLimit: Oracle.CHI_TRADE.GasLimitForTrade,
            gasPrice: Oracle.CHI_TRADE.GasPriceForTrade,
            value: Oracle.CHI_TRADE.GasCostForTrade
        }).then(async (tx) => {

            Logger.talk('Waiting for transaction to finish');
            await tx.wait();

        });

        const balanceAfter = await Store.walletBalance();

        this.TRADER.TradeCount++;

        this.TRADE.TradeNumber = this.TRADER.TradeCount;
        this.TRADE.Profit = balanceAfter - balanceBefore;

        this.TRADER.TotalProfit += this.TRADE.Profit;

        this.TRADE.Log();

    }

};