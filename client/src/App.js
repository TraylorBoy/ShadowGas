// vscode-fold=3
import React from 'react';
import ethers from 'ethers';
import {
    Flex,
    Box,
    Heading,
    Text,
    Card,
    Button,
    MetaMaskButton,
    Icon,
} from 'rimble-ui';

import Connect from './scripts/connect';

import Network from './components/Network';
import Connected from './components/Connected';
import Balances from './components/Balances';
import Store from './components/Store';
import Transfer from './components/Transfer';
import Trade from './components/Trade';

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
        balance: {
            eth: 0,
            gst: 0,
            lgt: 0,
            chi: 0,
            shouldUpdate: false,
        },
        network: 'Not Connected',
        isConnected: false,
        task: 'Connect',
    };

    /* -------------------------------------------------------------------------- */
    /*                                  Handlers                                  */
    /* -------------------------------------------------------------------------- */

    handleConnect = async () => {
        try {
            const _wallet = await Connect.connectWallet();
            const _walletAddress = await _wallet.getAddress();
            const _network = await _wallet.provider.getNetwork();
            const _shadow = await Connect.connectShadow(_wallet);

            this.setState((state) => ({
                shadow: _shadow,
                wallet: _wallet,
                walletAddress: _walletAddress,
                isConnected: true,
                network: _network.name.toUpperCase(),
                balance: {
                    shouldUpdate: true,
                },
            }));
        } catch (error) {
            console.error(error.message);
        }
    };

    handleMetaMaskConnect = async () => {
        try {
            const metaMask = await Connect.connectMetaMask();

            const _wallet = await metaMask.getSigner();
            const _walletAddress = await _wallet.getAddress();
            const _network = await metaMask.getNetwork();
            const _shadow = await Connect.connectShadow(_wallet);

            this.setState((state) => ({
                shadow: _shadow,
                wallet: _wallet,
                walletAddress: _walletAddress,
                isConnected: true,
                network: _network.name.toUpperCase(),
            }));
        } catch (error) {
            console.error(error.message);
        }
    };

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

    /* -------------------------------------------------------------------------- */
    /*                                    Tasks                                   */
    /* -------------------------------------------------------------------------- */

    connectTask = () => {
        this.setState((state) => ({ task: 'Connect' }));
    };

    balancesTask = async () => {
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
                    task: 'Balances',
                }));
            } catch (error) {
                console.error(error.message);
            }
        } else {
            this.setState((state) => ({
                task: 'Balances',
            }));
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
                                <Button
                                    icononly={true}
                                    size='small'
                                    icon='Assessment'
                                    mainColor={colors.element}
                                    onClick={this.tradeTask}
                                />
                                <Text mb={3}>Trade</Text>
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

                                {/* -------------------------------------------------------------------------- */}

                                {this.state.task === 'Connect' &&
                                    !this.state.isConnected && (
                                        <Box p={3}>
                                            <Heading pl={0}>Connect</Heading>

                                            <Box>
                                                <Text.p color={colors.text}>
                                                    Connect to your wallet
                                                    defined in your '.env.local'
                                                    file by pressing the button
                                                    below
                                                </Text.p>
                                                <Box textAlign='center'>
                                                    <Button
                                                        icon='AccountBalanceWallet'
                                                        mainColor={
                                                            colors.element
                                                        }
                                                        onClick={
                                                            this.handleConnect
                                                        }
                                                    >
                                                        Connect
                                                    </Button>
                                                </Box>

                                                <Text.p color={colors.text}>
                                                    You may also connect with
                                                    your MetaMask wallet
                                                </Text.p>
                                                <Box textAlign='center'>
                                                    <MetaMaskButton.Outline
                                                        mainColor={
                                                            colors.element
                                                        }
                                                        onClick={
                                                            this
                                                                .handleMetaMaskConnect
                                                        }
                                                    >
                                                        Connect with MetaMask
                                                    </MetaMaskButton.Outline>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}

                                {this.state.task === 'Connect' &&
                                    this.state.isConnected && (
                                        <Box p={3}>
                                            <Heading>Wallet Connected</Heading>

                                            <Box textAlign='center'>
                                                <Icon
                                                    name='CheckCircle'
                                                    color='success'
                                                    size='150'
                                                />
                                            </Box>
                                        </Box>
                                    )}

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
                                            updateBalance={
                                                this.handleBalanceUpdate
                                            }
                                        />
                                    </Box>
                                )}

                                {this.state.task === 'Transfer' && (
                                    <Box p={3}>
                                        <Heading>Transfer</Heading>
                                        <Transfer
                                            isConnected={this.state.isConnected}
                                            shadow={this.state.shadow}
                                            updateBalance={
                                                this.handleBalanceUpdate
                                            }
                                        />
                                    </Box>
                                )}

                                {this.state.task === 'Trade' && (
                                    <Box p={3}>
                                        <Heading>Trade</Heading>
                                        <Trade
                                            isConnected={this.state.isConnected}
                                            shadow={this.state.shadow}
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
