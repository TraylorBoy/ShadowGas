const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Logger = require('./logHelper');
const Gas = require('./gasHelper');
const uniswap = require('@uniswap/sdk');
require('dotenv').config();

exports.LGT_TRADE = {
    GasLimitForTrade: 0,
    GasPriceForTrade: 0,
    GasCostForTrade: 0,
    BuyAmount: parseInt(bre.shadowConfig.LgtTradeAmt),
    ExpectedProfit: 0,
    Profitable: false,
    Readable: {
        GasPrice: '',
        GasCost: '',
        Profit: ''
    },
    Log: () => {
        Logger.talk('Updated LGT Trade Info');
        Logger.talk(`LGT Buy Amount: ${this.LGT_TRADE.BuyAmount}`);
        Logger.talk(`Gas Limit: ${this.LGT_TRADE.GasLimitForTrade}`);
        Logger.talk(`Gas Price: ${this.LGT_TRADE.Readable.GasPrice}`);
        Logger.talk(this.LGT_TRADE.Readable.GasCost);
        Logger.talk(this.LGT_TRADE.Readable.Profit);
        Logger.talk(`Is Profitable: ${this.LGT_TRADE.Profitable}`);
    },
    TradeFound: async () => {

        await updateLgt();
        return this.LGT_TRADE.Profitable;
    },
    Update: async () => {
        await updateLgt();
    }
};

exports.CHI_TRADE = {
    UniswapPrice: 0,
    BuyAmount: parseInt(bre.shadowConfig.ChiTradeAmt)
};

const updateLgt = async () => {

    Logger.talk('Updating LGT Trade Info');

    const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    this.LGT_TRADE.GasPriceForTrade = await Gas.etherScanGasPrice();
    this.LGT_TRADE.Readable.GasPrice = `${this.LGT_TRADE.GasPriceForTrade / 1000000000} Gwei`;

    this.LGT_TRADE.GasLimitForTrade = 55000 * this.LGT_TRADE.BuyAmount; // overhead * amount

    const tradeInfo = await ShadowGas.lgtTradeInfo(parseInt(this.LGT_TRADE.BuyAmount), {
        gasLimit: this.LGT_TRADE.GasLimitForTrade,
        gasPrice: this.LGT_TRADE.GasPriceForTrade
    });

    this.LGT_TRADE.GasCostForTrade = tradeInfo[1];
    this.LGT_TRADE.Readable.GasCost = `Gas Cost: ${ethers.utils.formatEther(tradeInfo[1].toString())} Eth`;

    this.LGT_TRADE.ExpectedProfit = tradeInfo[0];
    this.LGT_TRADE.Readable.Profit = `Expected Profit: ${ethers.utils.formatEther(tradeInfo[0].toString())} Eth`;

    this.LGT_TRADE.Profitable = tradeInfo[2];

    this.LGT_TRADE.Log();

};

const uniswapv2ChiPrice = async () => {

    const CHI = new uniswap.Token(uniswap.ChainId.MAINNET, GasToken.chi.address, GasToken.chi.decimals);

    const pair = await uniswap.Fetcher.fetchPairData(CHI, uniswap.WETH[CHI.chainId]);

    const route = new uniswap.Route([pair], uniswap.WETH[CHI.chainId]);

    return route.midPrice.invert().toSignificant(6);

};