// vscode-fold=3
import React from 'react';
import ethers from 'ethers';
import { Box, Input, Flex, Button, Text } from 'rimble-ui';

import Gas from '../scripts/gas';

import VerifyTransaction from './VerifyTransaction';
import TransactionStarted from './TransactionStarted';
import TransactionComplete from './TransactionComplete';
import TransactionFail from './TransactionFailed';

/* -------------------------------------------------------------------------- */
/*                              Global Variables                              */
/* -------------------------------------------------------------------------- */

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

class Store extends React.Component {
    /* -------------------------------------------------------------------------- */
    /*                                    State                                   */
    /* -------------------------------------------------------------------------- */

    constructor(props) {
        super(props);

        this.state = {
            storeAmount: 1,
            shadow: props.shadow,
            wallet: props.wallet,
            walletAddress: '',
            isConnected: props.isConnected,
            updateBalance: props.updateBalance,
            verify: false,
            started: false,
            complete: false,
            failed: false,
            progress: 0,
            transaction: {
                token: '',
                etherScanLink: 'https://kovan.etherscan.io/address/',
                costToMint: 0,
                txCost: 0,
                waitTime: '',
                gasLimit: 0,
                gasPrice: 0,
                error: '',
            },
        };
    }

    /* -------------------------------------------------------------------------- */
    /*                                  Handlers                                  */
    /* -------------------------------------------------------------------------- */

    handleStoreAmountChange = (e) => {
        try {
            this.setState({
                storeAmount: e.target.value,
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    handleTransactionVerificationOpen = async (_token) => {
        try {
            await this.handleWalletAddress();

            const _costToMint = ethers.utils.formatEther(
                (39414 + 36224 * this.state.storeAmount).toString()
            );

            const { gasLimit, gasPrice, time, txCost } = await Gas.etherScan(
                'slow',
                this.state.storeAmount
            );

            if (this.state.isConnected && this.props.devWallet) {
                this.setState({
                    verify: true,
                    transaction: {
                        token: _token,
                        costToMint: _costToMint,
                        txCost,
                        gasLimit,
                        gasPrice,
                        waitTime: (parseInt(time) / 60).toFixed(0),
                    },
                });
            } else if (this.state.isConnected && !this.props.devWallet) {
                this.setState({
                    verify: true,
                    transaction: {
                        token: _token,
                        costToMint: _costToMint,
                        txCost,
                        gasLimit,
                        gasPrice,
                        waitTime: (parseInt(time) / 60).toFixed(0),
                    },
                });

                this.handleTransactionVerified(_token);
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    handleTransactionVerificationClose = async () => {
        try {
            if (this.state.isConnected) {
                this.setState({
                    verify: false,
                });
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    handleTransactionVerified = async (_token) => {
        try {
            if (this.state.isConnected) {
                if (_token === 'CHI') await this.storeChi();
                else if (_token === 'LGT') await this.storeLgt();
                else if (_token === 'GST') await this.storeGst();
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    handleWalletAddress = async () => {
        try {
            if (this.state.isConnected) {
                const _walletAddress = await this.state.wallet.getAddress();

                this.setState({
                    walletAddress: _walletAddress,
                    transaction: {
                        etherScanLink: `https://kovan.etherscan.io/address/${_walletAddress}`,
                    },
                });
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    handleTransactionClose = (modalName) => {
        if (modalName === 'start') {
            this.setState({
                started: false,
            });
        } else if (modalName === 'complete') {
            this.setState({
                complete: false,
            });
        } else if (modalName === 'fail') {
            this.setState({
                failed: false,
            });
        }
    };

    handleBalancesDisplay = async () => {
        await this.props.showBalance();
    };

    /* -------------------------------------------------------------------------- */
    /*                                    Store                                   */
    /* -------------------------------------------------------------------------- */

    storeChi = async () => {
        try {
            if (this.state.isConnected && this.props.devWallet) {
                this.setState({
                    verify: false,
                    started: true,
                    progress: 25,
                });

                const amount = this.state.storeAmount;
                const balance = await this.state.shadow.tankChi();

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', amount);

                await this.state.shadow
                    .refuelChi(amount, {
                        gasLimit,
                        gasPrice,
                    })
                    .then(async (tx) => {
                        this.setState({
                            progress: 50,
                        });

                        await tx.wait().then(async () => {
                            this.setState({
                                progress: 75,
                            });
                            const sleep = async (x) => {
                                return new Promise((resolve) => {
                                    setInterval(() => resolve(true), x);
                                });
                            };
                            let currBalance = await this.state.shadow.tankChi();

                            while (parseInt(currBalance) == parseInt(balance)) {
                                currBalance = await this.state.shadow.tankChi();
                                await sleep(15000);
                            }

                            this.setState({
                                progress: 100,
                            });
                        });
                    })
                    .then(async () => {
                        await this.state.updateBalance().then(() => {
                            this.setState({
                                started: false,
                                complete: true,
                            });
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        this.setState({
                            verify: false,
                            started: false,
                            complete: false,
                            failed: true,
                            transaction: {
                                error: err.message,
                            },
                        });
                    });
            } else if (this.state.isConnected && !this.props.devWallet) {
                const amount = this.state.storeAmount;
                const balance = await this.state.shadow.tankChi();
                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', amount);

                await this.state.shadow
                    .refuelChi(amount, {
                        gasLimit,
                        gasPrice,
                    })
                    .then(async (tx) => {
                        this.setState({
                            verify: false,
                            started: true,
                            progress: 50,
                        });

                        await tx.wait().then(async () => {
                            this.setState({
                                progress: 75,
                            });
                            const sleep = async (x) => {
                                return new Promise((resolve) => {
                                    setInterval(() => resolve(true), x);
                                });
                            };
                            let currBalance = await this.state.shadow.tankChi();

                            while (parseInt(currBalance) == parseInt(balance)) {
                                currBalance = await this.state.shadow.tankChi();
                                await sleep(15000);
                            }

                            this.setState({
                                progress: 100,
                            });
                        });
                    })
                    .then(async () => {
                        await this.state.updateBalance().then(() => {
                            this.setState({
                                started: false,
                                complete: true,
                            });
                        });
                    })
                    .catch((err) => {
                        this.setState({
                            verify: false,
                            started: false,
                            complete: false,
                            failed: true,
                            transaction: {
                                error: err.message,
                            },
                        });
                    });
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    storeLgt = async () => {
        try {
            if (this.state.isConnected && this.props.devWallet) {
                this.setState({
                    verify: false,
                    started: true,
                    progress: 25,
                });

                const amount = this.state.storeAmount;
                const balance = await this.state.shadow.tankLgt();

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', amount);

                await this.state.shadow
                    .refuelLgt(amount, {
                        gasLimit,
                        gasPrice,
                    })
                    .then(async (tx) => {
                        this.setState({
                            progress: 50,
                        });

                        await tx.wait().then(async () => {
                            this.setState({
                                progress: 75,
                            });
                            const sleep = async (x) => {
                                return new Promise((resolve) => {
                                    setInterval(() => resolve(true), x);
                                });
                            };
                            let currBalance = await this.state.shadow.tankLgt();

                            while (parseInt(currBalance) == parseInt(balance)) {
                                currBalance = await this.state.shadow.tankLgt();
                                await sleep(15000);
                            }

                            this.setState({
                                progress: 100,
                            });
                        });
                    })
                    .then(async () => {
                        await this.state.updateBalance().then(() => {
                            this.setState({
                                started: false,
                                complete: true,
                            });
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        this.setState({
                            verify: false,
                            started: false,
                            complete: false,
                            failed: true,
                            transaction: {
                                error: err.message,
                            },
                        });
                    });
            } else if (this.state.isConnected && !this.props.devWallet) {
                const amount = this.state.storeAmount;
                const balance = await this.state.shadow.tankLgt();
                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', amount);

                await this.state.shadow
                    .refuelLgt(amount, {
                        gasLimit,
                        gasPrice,
                    })
                    .then(async (tx) => {
                        this.setState({
                            verify: false,
                            started: true,
                            progress: 50,
                        });

                        await tx.wait().then(async () => {
                            this.setState({
                                progress: 75,
                            });
                            const sleep = async (x) => {
                                return new Promise((resolve) => {
                                    setInterval(() => resolve(true), x);
                                });
                            };
                            let currBalance = await this.state.shadow.tankLgt();

                            while (parseInt(currBalance) == parseInt(balance)) {
                                currBalance = await this.state.shadow.tankLgt();
                                await sleep(15000);
                            }

                            this.setState({
                                progress: 100,
                            });
                        });
                    })
                    .then(async () => {
                        await this.state.updateBalance().then(() => {
                            this.setState({
                                started: false,
                                complete: true,
                            });
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        this.setState({
                            verify: false,
                            started: false,
                            complete: false,
                            failed: true,
                            transaction: {
                                error: err.message,
                            },
                        });
                    });
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    storeGst = async () => {
        try {
            if (this.state.isConnected && this.props.devWallet) {
                this.setState({
                    verify: false,
                    started: true,
                    progress: 25,
                });

                const amount = this.state.storeAmount / 10 ** 2;
                const balance = ethers.utils.formatUnits(
                    await this.state.shadow.tankGst(),
                    2
                );

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', this.state.storeAmount);

                await this.state.shadow
                    .refuelGst(ethers.utils.parseUnits(amount.toString(), 2), {
                        gasLimit,
                        gasPrice,
                    })
                    .then(async (tx) => {
                        this.setState({
                            progress: 50,
                        });

                        await tx.wait().then(async () => {
                            this.setState({
                                progress: 75,
                            });
                            const sleep = async (x) => {
                                return new Promise((resolve) => {
                                    setInterval(() => resolve(true), x);
                                });
                            };
                            let currBalance = ethers.utils.formatUnits(
                                await this.state.shadow.tankGst(),
                                2
                            );

                            while (
                                parseFloat(currBalance.toString()) ==
                                parseFloat(balance.toString())
                            ) {
                                currBalance = ethers.utils.formatUnits(
                                    await this.state.shadow.tankGst(),
                                    2
                                );
                                await sleep(6000);
                            }

                            this.setState({
                                progress: 100,
                            });
                        });
                    })
                    .then(async () => {
                        await this.state.updateBalance().then(() => {
                            this.setState({
                                started: false,
                                complete: true,
                            });
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        this.setState({
                            verify: false,
                            started: false,
                            complete: false,
                            failed: true,
                            transaction: {
                                error: err.message,
                            },
                        });
                    });
            } else if (this.state.isConnected && !this.props.devWallet) {
                const amount = this.state.storeAmount / 10 ** 2;
                const balance = ethers.utils.formatUnits(
                    await this.state.shadow.tankGst(),
                    2
                );
                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', this.state.storeAmount);

                await this.state.shadow
                    .refuelGst(ethers.utils.parseUnits(amount.toString(), 2), {
                        gasLimit,
                        gasPrice,
                    })
                    .then(async (tx) => {
                        this.setState({
                            verify: false,
                            started: true,
                            progress: 50,
                        });

                        await tx.wait().then(async () => {
                            this.setState({
                                progress: 75,
                            });
                            const sleep = async (x) => {
                                return new Promise((resolve) => {
                                    setInterval(() => resolve(true), x);
                                });
                            };
                            let currBalance = ethers.utils.formatUnits(
                                await this.state.shadow.tankGst(),
                                2
                            );

                            while (
                                parseFloat(currBalance.toString()) ==
                                parseFloat(balance.toString())
                            ) {
                                currBalance = ethers.utils.formatUnits(
                                    await this.state.shadow.tankGst(),
                                    2
                                );
                                await sleep(15000);
                            }

                            this.setState({
                                progress: 100,
                            });
                        });
                    })
                    .then(async () => {
                        await this.state.updateBalance().then(() => {
                            this.setState({
                                started: false,
                                complete: true,
                            });
                        });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        this.setState({
                            verify: false,
                            started: false,
                            complete: false,
                            failed: true,
                            transaction: {
                                error: err.message,
                            },
                        });
                    });
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    /* -------------------------------------------------------------------------- */
    /*                                   Render                                   */
    /* -------------------------------------------------------------------------- */

    render() {
        return (
            <Box p={3}>
                <Box pb={3} textAlign='center'>
                    <Input
                        type='number'
                        required={true}
                        placeholder='1'
                        width={'50%'}
                        value={this.state.storeAmount}
                        onChange={this.handleStoreAmountChange}
                    />
                    <Text.p color={colors.text}>Amount</Text.p>
                </Box>

                <Flex flexDirection='row' textAlign='center'>
                    <Box width={1 / 3}>
                        <Button
                            size='small'
                            icon='Generic'
                            mainColor={colors.element}
                            onClick={() =>
                                this.handleTransactionVerificationOpen('GST')
                            }
                        >
                            GST2
                        </Button>
                    </Box>
                    <Box width={1 / 3}>
                        <Button
                            size='small'
                            icon='Generic'
                            mainColor={colors.element}
                            onClick={() =>
                                this.handleTransactionVerificationOpen('CHI')
                            }
                        >
                            CHI
                        </Button>
                    </Box>
                    <Box width={1 / 3}>
                        <Button
                            size='small'
                            icon='Generic'
                            mainColor={colors.element}
                            onClick={() =>
                                this.handleTransactionVerificationOpen('LGT')
                            }
                        >
                            LGT
                        </Button>
                    </Box>
                </Flex>

                <Box>
                    <Text.p color={colors.text}>
                        1 GST2 = 0.01 GST2 because the token requires 2
                        decimals. If you want to store 1 GST2, please enter
                        "100" into the input field
                    </Text.p>
                </Box>

                <VerifyTransaction
                    etherScanLink={this.state.transaction.etherScanLink}
                    verify={this.state.verify}
                    confirmPurchase={this.handleTransactionVerified}
                    cancelPurchase={this.handleTransactionVerificationClose}
                    address={this.state.walletAddress}
                    token={this.state.transaction.token}
                    buyAmount={this.state.storeAmount}
                    costToMint={this.state.transaction.costToMint}
                    txCost={this.state.transaction.txCost}
                    waitTime={this.state.transaction.waitTime}
                    isDev={this.props.devWallet}
                />

                <TransactionStarted
                    started={this.state.started}
                    token={this.state.transaction.token}
                    buyAmount={this.state.storeAmount}
                    costToMint={this.state.transaction.costToMint}
                    txCost={this.state.transaction.txCost}
                    waitTime={this.state.transaction.waitTime}
                    address={this.state.walletAddress}
                    etherScanLink={this.state.transaction.etherScanLink}
                    close={this.handleTransactionClose}
                    progress={this.state.progress}
                    isTransferTo={false}
                    toAddress={''}
                />

                <TransactionComplete
                    complete={this.state.complete}
                    buyAmount={this.state.storeAmount}
                    token={this.state.transaction.token}
                    etherScanLink={this.state.transaction.etherScanLink}
                    close={this.handleTransactionClose}
                    showBalance={this.handleBalancesDisplay}
                    completeMessage={`Purchased ${this.state.storeAmount} ${this.state.transaction.token} Token(s)`}
                />

                <TransactionFail
                    fail={this.state.failed}
                    close={this.handleTransactionClose}
                    etherScanLink={this.state.transaction.etherScanLink}
                    token={this.state.transaction.token}
                    buyAmount={this.state.storeAmount}
                    errorMessage={this.state.transaction.error}
                />
            </Box>
        );
    }
}

export default Store;
