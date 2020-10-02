// vscode-fold=3
import React from 'react';
import ethers from 'ethers';
import { Flex, Box, Heading, Text, Card, Button } from 'rimble-ui';

import Connect from './components/Connect';
import Network from './components/Network';
import Connected from './components/Connected';
import Balances from './components/Balances';
import Store from './components/Store';
import Transfer from './components/Transfer';
import Trade from './components/Trade';
import WrongNetwork from './components/WrongNetwork';

import './App.css';

/* -------------------------------------------------------------------------- */
/*                              Global Variables                              */
/* -------------------------------------------------------------------------- */

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

class App extends React.Component {
    /* -------------------------------------------------------------------------- */
    /*                                    State                                   */
    /* -------------------------------------------------------------------------- */

    state = {
        shadow: null,
        wallet: null,
        walletAddress: 'Not Connected',
        devWallet: false,
        balance: {
            eth: 0,
            gst: 0,
            lgt: 0,
            chi: 0,
            shouldUpdate: false,
        },
        network: 'Not Connected',
        isConnected: false,
        connectionRequired: false,
        networkRequired: false,
        task: 'Connect',
    };

    /* -------------------------------------------------------------------------- */
    /*                                  Handlers                                  */
    /* -------------------------------------------------------------------------- */

    handleBalanceUpdate = async () => {
        try {
            this.setState((state) => ({
                balance: {
                    shouldUpdate: true,
                },
            }));
        } catch (error) {
            console.error(error.message);
        }
    };

    handleConnectionRequest = async (
        _wallet,
        _walletAddress,
        _network,
        _shadow,
        _devWallet
    ) => {
        try {
            if (_network.name.toUpperCase() !== 'KOVAN') {
                this.setState({
                    networkRequired: true,
                    network: _network.name.toUpperCase(),
                });
            } else {
                this.setState((state) => ({
                    shadow: _shadow,
                    wallet: _wallet,
                    walletAddress: _walletAddress,
                    isConnected: true,
                    network: _network.name.toUpperCase(),
                    devWallet: _devWallet,
                    balance: {
                        shouldUpdate: true,
                    },
                }));
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    handleConnectionRequired = async () => {
        this.setState({
            connectionRequired: true,
        });

        this.connectTask();
    };

    handleCloseConnectionRequired = async () => {
        this.setState({
            connectionRequired: false,
        });
    };

    handleCloseNetworkRequired = async () => {
        this.setState({
            networkRequired: false,
        });
    };

    /* -------------------------------------------------------------------------- */
    /*                                    Tasks                                   */
    /* -------------------------------------------------------------------------- */

    connectTask = () => {
        this.setState((state) => ({ task: 'Connect' }));
    };

    balancesTask = async () => {
        this.setState((state) => ({
            task: 'Balances',
        }));

        if (this.state.isConnected && this.state.balance.shouldUpdate) {
            try {
                const gstBalance = ethers.utils.formatUnits(
                    await this.state.shadow.tankGst(),
                    2
                );
                const chiBalance = parseInt(await this.state.shadow.tankChi());
                const lgtBalance = parseInt(await this.state.shadow.tankLgt());
                const ethBalance = parseFloat(
                    ethers.utils.formatEther(
                        await this.state.wallet.getBalance()
                    )
                ).toFixed(6);

                this.setState((state) => ({
                    balance: {
                        gst: gstBalance,
                        chi: chiBalance,
                        lgt: lgtBalance,
                        eth: ethBalance,
                        shouldUpdate: false,
                    },
                }));
            } catch (error) {
                console.error(error.message);
            }
        }
    };

    storeTask = () => {
        this.setState((state) => ({ task: 'Store' }));
    };

    transferTask = () => {
        this.setState((state) => ({ task: 'Transfer' }));
    };

    tradeTask = () => {
        this.setState((state) => ({ task: 'Trade' }));
    };

    /* -------------------------------------------------------------------------- */
    /*                                   Render                                   */
    /* -------------------------------------------------------------------------- */

    render() {
        return (
            <div id='app'>
                {/* -------------------------------------------------------------------------- */}
                <Flex id='status'>
                    <Box>
                        <Network networkName={this.state.network} />
                    </Box>

                    <Box>
                        <Connected
                            isConnected={this.state.isConnected}
                            address={this.state.walletAddress}
                        />
                    </Box>
                </Flex>
                {/* -------------------------------------------------------------------------- */}
                {/*
                --------------------------------------------------------------------------
                */
                /* Nagivation */
                /*
                --------------------------------------------------------------------------
                */}
                <Flex id='content-wrap'>
                    <Card
                        p={3}
                        border='0px'
                        borderRadius='5px'
                        width={'auto'}
                        m={'auto'}
                        bg={colors.container}
                    >
                        <Flex>
                            <Box ml={0} p={3} borderRight='1px solid'>
                                <Button
                                    icononly={true}
                                    size='small'
                                    icon='AccountBalanceWallet'
                                    mainColor={colors.element}
                                    onClick={this.connectTask}
                                />
                                <Text mb={3}>Connect</Text>
                                <Button
                                    icononly={true}
                                    size='small'
                                    icon='MonetizationOn'
                                    mainColor={colors.element}
                                    onClick={this.balancesTask}
                                />
                                <Text mb={3}>Balances</Text>
                                <Button
                                    icononly={true}
                                    size='small'
                                    icon='FileUpload'
                                    mainColor={colors.element}
                                    onClick={this.storeTask}
                                />
                                <Text mb={3}>Store</Text>
                                <Button
                                    icononly={true}
                                    size='small'
                                    icon='SwapVert'
                                    mainColor={colors.element}
                                    onClick={this.transferTask}
                                />
                                <Text mb={3}>Transfer</Text>
                                {/*
                                --------------------------------------------------------------------------
                                */}{' '}
                                {/* TODO: TRADE*/}
                                {/*<Button
                                    icononly={true}
                                    size='small'
                                    icon='Assessment'
                                    mainColor={colors.element}
                                    onClick={this.tradeTask}
                                />
                                <Text mb={3}>Trade</Text>*/}
                            </Box>

                            {/* -------------------------------------------------------------------------- */}

                            <Flex flexDirection='column' width={'100%'}>
                                <Box p={1} borderBottom='1px solid'>
                                    <Heading color={colors.text}>
                                        Light Station
                                    </Heading>

                                    <Box>
                                        <Text color={colors.text}>
                                            Stores, Transfers, and Trades
                                            Ethereum Gas Tokens
                                        </Text>
                                    </Box>
                                </Box>

                                {this.state.task === 'Connect' && (
                                    <Box p={3}>
                                        <Heading pl={0}>Connect</Heading>

                                        <Connect
                                            isConnected={this.state.isConnected}
                                            connectionRequest={
                                                this.handleConnectionRequest
                                            }
                                            closeRequired={
                                                this
                                                    .handleCloseConnectionRequired
                                            }
                                            connectionRequired={
                                                this.state.connectionRequired
                                            }
                                        ></Connect>
                                    </Box>
                                )}

                                <WrongNetwork
                                    networkRequired={this.state.networkRequired}
                                    closeWrongNetwork={
                                        this.handleCloseNetworkRequired
                                    }
                                    networkName={this.state.network}
                                />

                                {this.state.task === 'Balances' && (
                                    <Box p={3}>
                                        <Heading>Balances</Heading>
                                        <Balances
                                            balances={this.state.balance}
                                        />
                                    </Box>
                                )}

                                {this.state.task === 'Store' && (
                                    <Box p={3}>
                                        <Heading>Store</Heading>
                                        <Store
                                            isConnected={this.state.isConnected}
                                            shadow={this.state.shadow}
                                            wallet={this.state.wallet}
                                            devWallet={this.state.devWallet}
                                            requestConnection={
                                                this.handleConnectionRequired
                                            }
                                            updateBalance={
                                                this.handleBalanceUpdate
                                            }
                                            showBalance={this.balancesTask}
                                        />
                                    </Box>
                                )}

                                {this.state.task === 'Transfer' && (
                                    <Box p={3}>
                                        <Heading>Transfer</Heading>
                                        <Transfer
                                            isConnected={this.state.isConnected}
                                            shadow={this.state.shadow}
                                            wallet={this.state.wallet}
                                            devWallet={this.state.devWallet}
                                            requestConnection={
                                                this.handleConnectionRequired
                                            }
                                            updateBalance={
                                                this.handleBalanceUpdate
                                            }
                                            showBalance={this.balancesTask}
                                        />
                                    </Box>
                                )}

                                {this.state.task === 'Trade' && (
                                    <Box p={3}>
                                        <Heading>Trade</Heading>
                                        <Trade
                                            isConnected={this.state.isConnected}
                                            shadow={this.state.shadow}
                                            requestConnection={
                                                this.handleConnectionRequired
                                            }
                                            updateBalance={
                                                this.handleBalanceUpdate
                                            }
                                        />
                                    </Box>
                                )}
                            </Flex>
                        </Flex>
                    </Card>
                </Flex>
            </div>
        );
    }
}

export default App;
