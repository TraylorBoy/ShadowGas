// vscode-fold=3
import React, { useState } from 'react';
import ethers from 'ethers';
import { Box, Button, Text } from 'rimble-ui';

import Oracle from '../scripts/oracle';
import TradeInfo from './TradeInfo';
import Trader from './Trader';

/* -------------------------------------------------------------------------- */
/*                              Global Variables                              */
/* -------------------------------------------------------------------------- */

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

let counter = 0;

class Trade extends React.Component {
    /* -------------------------------------------------------------------------- */
    /*                                    State                                   */
    /* -------------------------------------------------------------------------- */

    constructor(props) {
        super(props);

        this.state = {
            isConnected: props.isConnected,
            shadow: props.shadow,
            oracle: Oracle,
            startOracle: false,
            startTrader: false,
            trader: {
                tradeLimit: 3,
                amountToBuy: 1,
                totalTrades: 0,
                trade: {
                    count: 0,
                    profit: 0,
                },
            },
        };
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Handlers                                  */
    /* -------------------------------------------------------------------------- */

    handleTradeAmount = (e) => {
        this.setState({
            trader: {
                amountToBuy: e.target.value,
            },
        });
    };

    /* -------------------------------------------------------------------------- */
    /*                                  Trade                                     */
    /* -------------------------------------------------------------------------- */

    updateOracle = async () => {
        if (this.state.isConnected) {
            const _oracle = await Oracle.Update(
                this.state.shadow,
                this.state.trader.amountToBuy
            );

            this.setState({
                oracle: _oracle,
            });
        }
    };

    runOracle = async () => {
        await this.updateOracle();

        this.setState({
            startOracle: true,
        });
    };

    stopOracle = () => {
        this.setState({
            startOracle: false,
        });
    };

    runTrader = async () => {
        await this.updateOracle();

        const trade = async () => {
            this.setState({
                startTrader: true,
            });

            const sleep = async (x) => {
                return new Promise((resolve) => {
                    setInterval(() => resolve(true), x);
                });
            };

            while (counter < this.state.trader.tradeLimit) {
                counter++;

                await sleep(6000);
                await this.updateOracle();
            }

            this.setState({
                trader: {
                    totalTrades: counter,
                },
            });
        };

        if (this.state.isConnected) {
            await trade();
        }
    };

    stopTrader = () => {
        this.setState({
            startTrader: false,
        });
    };

    /* -------------------------------------------------------------------------- */
    /*                                   Render                                   */
    /* -------------------------------------------------------------------------- */

    render() {
        return (
            <Box p={3} textAlign='center'>
                <TradeInfo
                    trader={this.state.trader}
                    oracle={this.state.oracle}
                    handleTradeAmount={this.handleTradeAmount}
                    update={this.updateOracle}
                    start={this.state.startOracle}
                    stop={this.stopOracle}
                />
                <Trader
                    counter={counter}
                    oracle={this.state.oracle}
                    update={this.updateOracle}
                    start={this.state.startTrader}
                    stop={this.stopTrader}
                />
                <Box pb={3}>
                    <Text.p color={colors.text}>
                        The trader will run until the specified trade limit is
                        reached. While running it will look for trading
                        opportunities and initiate the arbitrage trade if it is
                        profitable. The trader will ONLY trade Liquid Gas Tokens
                        (LGT)
                    </Text.p>
                    <Button onClick={this.runOracle} mainColor={colors.element}>
                        Run Oracle
                    </Button>
                </Box>

                <Box>
                    <Text.p color={colors.text}>
                        The trader will run until the specified trade limit is
                        reached. While running it will look for trading
                        opportunities and initiate the arbitrage trade if it is
                        profitable. The trader will ONLY trade Liquid Gas Tokens
                        (LGT)
                    </Text.p>
                    <Button onClick={this.runTrader} mainColor={colors.element}>
                        Start Trader
                    </Button>
                </Box>
            </Box>
        );
    }
}

export default Trade;
