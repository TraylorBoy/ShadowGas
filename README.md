<h1 align="center">ShadowGas</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-2.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/TraylorBoy/ShadowGas#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/TraylorBoy/ShadowGas/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/TraylorBoy/ShadowGas/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/TraylorBoy/ShadowGas" />
  </a>
</p>

> Stores, Transfers, and Trades, Ethereum Gas Tokens

## Features

1. Stores and Transfers 1Inch Chi Tokens, Liquid Gas Tokens, and GST2 Tokens
2. Trades Liquid Gas Tokens
3. Light Station UI to interact with the deployed contract on the Kovan test network via your web browser and MetaMask wallet

## Install

```sh
git clone https://github.com/TraylorBoy/ShadowGas.git

cd ShadowGas

yarn install
```

## UI

```sh
cd client

yarn install

yarn start
```

**Default network is Kovan**

**You will need to create a `.env` file (see below)**

## .env

```sh
SHADOWGAS="" - Contract Address
WALLET="" - Wallet Address
PRIVATEKEY="" - Wallet Private Key
KOVAN="" - Kovan Infura url
ROPSTEN="" - Ropsten Infura url
MAINNET="" - Mainnet Infura url
ETHERSCAN="" - Etherscan API Key
ETH_GAS_STATION="" - EthGasStation API Key
```

## shadow.config.json

```sh
`RefuelChiAmt` - Mint Chi Amount
`RefuelLgtAmt` - Mint Lgt Amount
`RefuelGstAmt` - Mint Gst Amount
`EmptyChiAmt` - Transfer Chi Amount
`EmptyLgtAmt` - Transfer Lgt Amount
`EmptyGstAmt` - Transfer Gst Amount
`EmptyChiTo` - Address to transfer Chi to
`EmptyLgtTo` - Address to transfer Lgt to
`EmptyGstTo` - Address to transfer Gst to
`GasLimit` - Gas Limit
`GasSpeed` - Gas Speed ("fast", "average", "slow")
`TradeLimit` - The amount of trades to perform
`LgtTradeAmount` - Amount of LGT Tokens to trade
```

Gas Price is retrieved from https://ethgasstation.info/ and https://etherscan.io/gastracker

You will need an API key for both!

**Create _.env_ file then modify _shadow.config.json_ and _buidler.config.js_ (module.exports) before running tasks/tests**

## Deploy

_ShadowGas contract size is 6.39(Kb)_

```sh
npx buidler deploy
```

Will deploy contract to the `defaultNetwork` defined in `buidler.config.js`

**Be sure to copy address and include it in your `.env` file**

## Store

\*`<GAS_TOKEN>` should be either **Chi**, **Lgt**, or **Gst\***

### Refuel

```sh
npx buidler refuel --token <GAS_TOKEN>
```

Mints either Chi, Lgt, or Gst tokens and stores them at contract's address

### Tank

```sh
npx buidler tank --token <GAS_TOKEN>
```

Retrieves Chi, Lgt, or Gst token balance at contract's address

## Transfer

\*`<GAS_TOKEN>` should be either **Chi** or **Lgt\***

### Empty

```sh
npx buidler empty --token <GAS_TOKEN>
```

Sends Chi, Lgt, or Gst from contract to possessor _(contract owner)_

### EmptyTo

```sh
npx buidler emptyTo --token <GAS_TOKEN>
```

Sends Chi, Lgt, or Gst from contract to address _(modify in shadow.config.json)_

## Trade

_Only trades LGT, but can use refueled CHI for discounts so profit may be more than expected if discount is applied_

### Oracle

```sh
npx buidler oracle
```

Will retrieve trade information for arbitrage

### Arbitrage

```sh
npx buidler arbitrage
```

Will run a loop to continuously check for trade opportunities every minute and will execute trades if an opportunity is found until `TradeLimit` is reached

## Run tests

```sh
npx buidler test
```

Will test _ALL_ contract functions

```sh
npx buidler test ./test/gst-test.js
```

Will test only the contract's gst functions

```sh
npx buidler test ./test/chi-test.js
```

Will test only the contract's chi functions

```sh
npx buidler test ./test/lgt-test.js
```

Will test only the contract's lgt functions

**May require ether to run transfer tests**

## Examples

### Store

https://dev.to/traylorboy/shadowgas-store-40m9

### Transfer

https://dev.to/traylorboy/shadowgas-transfer-59jg

### Trade

https://dev.to/traylorboy/shadowgas-trade-1a5a

## Roadmap

1. UI (v2.0.0)
2. CHI & GST Trades (v2.1.0)
3. More trading strategies (v2.2.0)
4. IShadowGas (v3.0.0)

## Resources

https://ethgasstation.info/

https://1inch.exchange/#/faq/everything-you-wanted-to-know-about-chi-gastoken

https://github.com/matnad/liquid-gas-token

https://buidler.dev/

https://github.com/projectchicago/gastoken

## Author

👤 **Marques Traylor**

-   Github: [@TraylorBoy](https://github.com/TraylorBoy)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/TraylorBoy/ShadowGas/issues). You can also take a look at the [contributing guide](https://github.com/TraylorBoy/ShadowGas/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Marques Traylor](https://github.com/TraylorBoy).<br />
This project is [MIT](https://github.com/TraylorBoy/ShadowGas/blob/master/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
