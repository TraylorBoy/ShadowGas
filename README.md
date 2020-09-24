<h1 align="center">ShadowGas</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
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

1. Stores and Transfers 1Inch Chi Tokens and Liquid Gas Tokens
2. Trades Liquid Gas Tokens

## Install

```sh
git clone https://github.com/TraylorBoy/ShadowGas.git

cd ShadowGas

yarn install
```

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
`EmptyChiAmt` - Transfer Chi Amount
`EmptyLgtAmt` - Transfer Lgt Amount
`EmptyChiTo` - Address to transfer Chi to
`EmptyLgtTo` - Address to transfer Lgt to
`GasLimit` - Gas Limit
`GasSpeed` - Gas Speed ("fast", "average", "slow") 
`TradeLimit` - The amount of trades to perform
`LgtTradeAmount` - Amount of LGT Tokens to trade
```

Gas Price is retrieved from https://ethgasstation.info/ and https://etherscan.io/gastracker

You will need an API key for both!

**Modify *shadow.config.js* and *buidler.config.js* before running tasks if you want to change default variables**

```sh
shadow.config.js

{
 "RefuelChiAmt": "1",
  ...
}

```

```sh
buidler.config.js

...

module.exports = {
  defaultNetwork: "Kovan",
  ...
 }
```

## Deploy

```sh
npx buidler deploy
```

Will deploy contract to the `defaultNetwork` defined in `buidler.config.js`

**Be sure to copy address and include it in your `.env` file**

## Store

*`<GAS_TOKEN>` should be either **Chi** or **Lgt***

### Refuel

```sh
npx buidler refuel --token <GAS_TOKEN>
```

Mints either Chi or Lgt tokens and stores them at contract's address

### Tank

```sh
npx buidler tank --token <GAS_TOKEN>
```

Retrieves Chi or Lgt token balance at contract's address

## Transfer

*`<GAS_TOKEN>` should be either **Chi** or **Lgt***

### Empty

```sh
npx buidler empty --token <GAS_TOKEN>
```

Sends Chi or Lgt from contract to possessor *(contract owner)*

### EmptyTo

```sh
npx buidler emptyTo --token <GAS_TOKEN>
```

Sends Chi or Lgt from contract to address *(modify in shadow.config.js)*

## Trade

*Only trades LGT, but can use refueled CHI for discounts so profit may be more than expected if discount is applied*

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

Will test *ALL* contract functions

```sh
npx buidler test ./test/store-test.js
```

Will test only the contract's store functions

```sh
npx buidler test ./test/transfer-test.js
```

Will test only the contract's transfer functions

**May require ether to run transfer tests**

## Examples

### Store
https://dev.to/traylorboy/shadowgas-store-40m9

### Transfer
https://dev.to/traylorboy/shadowgas-transfer-59jg

### TODO: Trade

## Roadmap

1. Add GST functionality (v1.1.0)
2. LightStation UI (v2.0.0)
3. CHI & GST Trades (v2.1.0)
4. More trading strategies (v2.2.0)
5. IShadowGas (v3.0.0)
6. Deploy ShadowGas to mainnet (v3.0.0)
7. Begin work on LightStation

## Resources

https://ethgasstation.info/

https://1inch.exchange/#/faq/everything-you-wanted-to-know-about-chi-gastoken

https://github.com/matnad/liquid-gas-token

https://buidler.dev/

## Author

👤 **Marques Traylor**

* Github: [@TraylorBoy](https://github.com/TraylorBoy)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/TraylorBoy/ShadowGas/issues). You can also take a look at the [contributing guide](https://github.com/TraylorBoy/ShadowGas/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Marques Traylor](https://github.com/TraylorBoy).<br />
This project is [MIT](https://github.com/TraylorBoy/ShadowGas/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
