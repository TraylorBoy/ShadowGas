const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Logger = require('./logHelper');
const Gas = require('./gasHelper');
const GasToken = require('./gasToken');
const uniswap = require('@uniswap/sdk');
const fetch = require('node-fetch');
const {
    TokenAmount
} = require('@uniswap/sdk');
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
        Logger.talk(`Max TX Cost: ${ethers.utils.formatEther((this.LGT_TRADE.GasLimitForTrade * this.LGT_TRADE.GasPriceForTrade).toString())}`);
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
    GasLimitForTrade: 0,
    GasPriceForTrade: 0,
    GasCostForTrade: 0,
    BuyAmount: parseInt(bre.shadowConfig.ChiTradeAmt),
    ExpectedProfit: 0,
    Profitable: false,
    Readable: {
        GasPrice: '',
        GasCost: '',
        Profit: ''
    },
    Log: () => {
        Logger.talk('Updated CHI Trade Info');
        Logger.talk(`CHI Buy Amount: ${this.CHI_TRADE.BuyAmount}`);
        Logger.talk(`Gas Limit: ${this.CHI_TRADE.GasLimitForTrade}`);
        Logger.talk(`Gas Price: ${this.CHI_TRADE.Readable.GasPrice}`);
        Logger.talk(this.CHI_TRADE.Readable.GasCost);
        Logger.talk(this.CHI_TRADE.Readable.Profit);
        Logger.talk(`Is Profitable: ${this.CHI_TRADE.Profitable}`);
        Logger.talk(`Max TX Cost: ${ethers.utils.formatEther((this.CHI_TRADE.GasLimitForTrade * this.CHI_TRADE.GasPriceForTrade).toString())}`);
    },
    TradeFound: async () => {

        await updateChi();
        return this.CHI_TRADE.Profitable;
    },
    Update: async () => {
        await updateChi();
    }
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

const updateChi = async () => {

    Logger.talk('Updating CHI Trade Info');

    //const expectedProfit = (await uniswapv2ChiProfit(true)).toString(); //uniswap

    const expectedProfit = (await oneInchProfit()).toString(); // oneInch

    this.CHI_TRADE.Readable.Profit = `Expected Profit: ${expectedProfit} Eth`;
    this.CHI_TRADE.ExpectedProfit = ethers.utils.parseEther(expectedProfit);

    this.CHI_TRADE.GasPriceForTrade = await Gas.etherScanGasPrice();
    this.CHI_TRADE.Readable.GasPrice = `${this.CHI_TRADE.GasPriceForTrade / 1000000000} Gwei`;

    this.CHI_TRADE.GasLimitForTrade = 55000 * this.CHI_TRADE.BuyAmount; // overhead * amount

    this.CHI_TRADE.GasCostForTrade = ethers.BigNumber.from(((39141 + 36224 * this.CHI_TRADE.BuyAmount + 55000) * this.CHI_TRADE.GasPriceForTrade).toString());

    this.CHI_TRADE.Readable.GasCost = `Gas Cost: ${ethers.utils.formatEther(this.CHI_TRADE.GasCostForTrade.toString())} Eth`; // Mint

    if (this.CHI_TRADE.ExpectedProfit > this.CHI_TRADE.GasCostForTrade) this.CHI_TRADE.Profitable = true;

    this.CHI_TRADE.Log();

};

const oneInchProfit = async () => {

    const amountIn = ethers.BigNumber.from(this.CHI_TRADE.BuyAmount.toString());

    const request = await fetch(`https://api.1inch.exchange/v1.1/quote?fromTokenSymbol=CHI&toTokenSymbol=ETH&amount=${amountIn}`);

    const res = await request.json();

    return parseFloat(ethers.utils.formatEther(res.toTokenAmount)).toFixed(9);
}

const uniswapv2ChiProfit = async (withSlippage) => {

    const CHI = new uniswap.Token(uniswap.ChainId.MAINNET, GasToken.chi.address, GasToken.chi.decimals);

    const pair = await uniswap.Fetcher.fetchPairData(CHI, uniswap.WETH[CHI.chainId]);

    const route = new uniswap.Route([pair], CHI);

    const amountIn = ethers.BigNumber.from(this.CHI_TRADE.BuyAmount.toString());

    const trade = new uniswap.Trade(route, new TokenAmount(CHI, amountIn), uniswap.TradeType.EXACT_INPUT);

    const slippage = new uniswap.Percent('50', '10000') // 0.5

    return withSlippage ? trade.minimumAmountOut(slippage).toSignificant(9) : trade.outputAmount.toSignificant(9);

};