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

class Transfer extends React.Component {
    /* -------------------------------------------------------------------------- */
    /*                                    State                                   */
    /* -------------------------------------------------------------------------- */

    constructor(props) {
        super(props);

        this.state = {
            transferAmount: 1,
            transferAddress: '',
            isTransferTo: false,
            shadow: props.shadow,
            isConnected: props.isConnected,
            updateBalance: props.updateBalance,
            wallet: props.wallet,
            walletAddress: '',
            verify: false,
            started: false,
            complete: false,
            failed: false,
            progress: 0,
            transaction: {
                token: '',
                etherScanLink: 'https://kovan.etherscan.io/',
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

    handleTransferAmountChange = (e) => {
        try {
            this.setState({
                transferAmount: e.target.value,
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    handleTransferAddressChange = (e) => {
        try {
            if (ethers.utils.isAddress(e.target.value)) {
                this.setState({
                    transferAddress: e.target.value,
                    isTransferTo: true,
                });
            } else {
                throw new Error('Not a valid address');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    handleTransactionVerificationOpen = async (_token) => {
        try {
            await this.handleWalletAddress();

            const _costToMint = ethers.utils.formatEther(
                (39414 + 36224 * this.state.transferAmount).toString()
            );

            const { gasLimit, gasPrice, time, txCost } = await Gas.etherScan(
                'slow',
                this.state.transferAmount
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
                if (_token === 'CHI') await this.transferChi();
                else if (_token === 'LGT') await this.transferLgt();
                else if (_token === 'GST') await this.transferGst();
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
    /*                                  Transfer                                  */
    /* -------------------------------------------------------------------------- */

    transferChi = async () => {
        try {
            if (this.state.isConnected && this.props.devWallet) {
                this.setState({
                    verify: false,
                    started: true,
                    progress: 25,
                });

                const amount = this.state.transferAmount;
                const address = this.state.transferAddress;
                const balance = await this.state.shadow.tankChi();

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', this.state.transferAmount);

                if (address === '') {
                    await this.state.shadow
                        .emptyChiTank(amount, {
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

                                while (
                                    parseInt(currBalance) == parseInt(balance)
                                ) {
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
                } else if (ethers.utils.isAddress(address)) {
                    await this.state.shadow
                        .emptyChiTankTo(amount, address, {
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

                                while (
                                    parseInt(currBalance) == parseInt(balance)
                                ) {
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
                } else {
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
            } else if (this.state.isConnected && !this.props.devWallet) {
                const amount = this.state.transferAmount;
                const address = this.state.transferAddress;
                const balance = await this.state.shadow.tankChi();

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', this.state.transferAmount);

                if (address === '') {
                    await this.state.shadow
                        .emptyChiTank(amount, {
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

                                while (
                                    parseInt(currBalance) == parseInt(balance)
                                ) {
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
                } else if (ethers.utils.isAddress(address)) {
                    await this.state.shadow
                        .emptyChiTankTo(amount, address, {
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

                                while (
                                    parseInt(currBalance) == parseInt(balance)
                                ) {
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
                } else {
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
            this.setState({
                verify: false,
                started: false,
                complete: false,
                failed: true,
                transaction: {
                    error: error.message,
                },
            });
        }
    };

    transferLgt = async () => {
        try {
            if (this.state.isConnected && this.props.devWallet) {
                this.setState({
                    verify: false,
                    started: true,
                    progress: 25,
                });

                const amount = this.state.transferAmount;
                const address = this.state.transferAddress;
                const balance = await this.state.shadow.tankLgt();

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', this.state.transferAmount);

                if (address === '') {
                    await this.state.shadow
                        .emptyLgtTank(amount, {
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

                                while (
                                    parseInt(currBalance) == parseInt(balance)
                                ) {
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
                } else if (ethers.utils.isAddress(address)) {
                    await this.state.shadow
                        .emptyLgtTankTo(amount, address, {
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

                                while (
                                    parseInt(currBalance) == parseInt(balance)
                                ) {
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
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
            } else if (this.state.isConnected && !this.props.devWallet) {
                const amount = this.state.transferAmount;
                const address = this.state.transferAddress;
                const balance = await this.state.shadow.tankLgt();

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', this.state.transferAmount);

                if (address === '') {
                    await this.state.shadow
                        .emptyLgtTank(amount, {
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

                                while (
                                    parseInt(currBalance) == parseInt(balance)
                                ) {
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
                } else if (ethers.utils.isAddress(address)) {
                    await this.state.shadow
                        .emptyLgtTankTo(amount, address, {
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

                                while (
                                    parseInt(currBalance) == parseInt(balance)
                                ) {
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
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
            this.setState({
                verify: false,
                started: false,
                complete: false,
                failed: true,
                transaction: {
                    error: error.message,
                },
            });
        }
    };

    transferGst = async () => {
        try {
            if (this.state.isConnected && this.props.devWallet) {
                this.setState({
                    verify: false,
                    started: true,
                    progress: 25,
                });

                const amount = this.state.transferAmount / 10 ** 2;
                const address = this.state.transferAddress;
                const balance = ethers.utils.formatUnits(
                    await this.state.shadow.tankGst(),
                    2
                );

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', this.state.transferAmount);

                if (address === '') {
                    await this.state.shadow
                        .emptyGstTank(amount, {
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
                } else if (ethers.utils.isAddress(address)) {
                    await this.state.shadow
                        .emptyGstTankTo(
                            ethers.utils.parseUnits(amount.toString(), 2),
                            address,
                            {
                                gasLimit,
                                gasPrice,
                            }
                        )
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
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
            } else if (this.state.isConnected && !this.props.devWallet) {
                const amount = this.state.transferAmount / 10 ** 2;
                const address = this.state.transferAddress;
                const balance = ethers.utils.formatUnits(
                    await this.state.shadow.tankGst(),
                    2
                );

                const {
                    gasLimit,
                    gasPrice,
                    time,
                    txCost,
                } = await Gas.etherScan('slow', this.state.transferAmount);

                if (address === '') {
                    await this.state.shadow
                        .emptyGstTank(
                            ethers.utils.parseUnits(amount.toString(), 2),
                            {
                                gasLimit,
                                gasPrice,
                            }
                        )
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
                } else if (ethers.utils.isAddress(address)) {
                    await this.state.shadow
                        .emptyGstTankTo(
                            ethers.utils.parseUnits(amount.toString(), 2),
                            address,
                            {
                                gasLimit,
                                gasPrice,
                            }
                        )
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
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
            } else {
                await this.props.requestConnection();
            }
        } catch (error) {
            console.error(error.message);
            this.setState({
                verify: false,
                started: false,
                complete: false,
                failed: true,
                transaction: {
                    error: error.message,
                },
            });
        }
    };

    /* -------------------------------------------------------------------------- */
    /*                                   Render                                   */
    /* -------------------------------------------------------------------------- */

    render() {
        return (
            <Box p={3}>
                <Box>
                    <Box pb={3} textAlign='center'>
                        <Box width={1} pb={3}>
                            <Input
                                type='number'
                                required={true}
                                placeholder='1'
                                width={'50%'}
                                value={this.state.transferAmount}
                                onChange={this.handleTransferAmountChange}
                            />
                            <Text color={colors.text}>Amount</Text>
                        </Box>
                        <Box width={1}>
                            <Input
                                type='text'
                                required={false}
                                placeholder='e.g. 0x4B2c5b6331eC7B8b1ec741966555Ae7E23D47C06'
                                width={'50%'}
                                value={this.state.transferAddress}
                                onChange={this.handleTransferAddressChange}
                            />
                            <Text color={colors.text}>
                                To Address (Optional)
                            </Text>
                        </Box>
                    </Box>

                    <Flex flexDirection='row' textAlign='center'>
                        <Box width={1 / 3}>
                            <Button
                                size='small'
                                icon='Generic'
                                mainColor={colors.element}
                                onClick={() =>
                                    this.handleTransactionVerificationOpen(
                                        'GST'
                                    )
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
                                    this.handleTransactionVerificationOpen(
                                        'CHI'
                                    )
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
                                    this.handleTransactionVerificationOpen(
                                        'LGT'
                                    )
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
                </Box>
                <VerifyTransaction
                    etherScanLink={this.state.transaction.etherScanLink}
                    verify={this.state.verify}
                    confirmPurchase={this.handleTransactionVerified}
                    cancelPurchase={this.handleTransactionVerificationClose}
                    address={this.state.walletAddress}
                    token={this.state.transaction.token}
                    buyAmount={this.state.transferAmount}
                    costToMint={this.state.transaction.costToMint}
                    txCost={this.state.transaction.txCost}
                    waitTime={this.state.transaction.waitTime}
                    isDev={this.props.devWallet}
                />

                <TransactionStarted
                    started={this.state.started}
                    token={this.state.transaction.token}
                    buyAmount={this.state.transferAmount}
                    costToMint={this.state.transaction.costToMint}
                    txCost={this.state.transaction.txCost}
                    waitTime={this.state.transaction.waitTime}
                    address={this.state.walletAddress}
                    etherScanLink={this.state.transaction.etherScanLink}
                    close={this.handleTransactionClose}
                    progress={this.state.progress}
                    isTransferTo={this.state.isTransferTo}
                    toAddress={this.state.transferAddress}
                />

                <TransactionComplete
                    complete={this.state.complete}
                    buyAmount={this.state.transferAmount}
                    token={this.state.transaction.token}
                    etherScanLink={this.state.transaction.etherScanLink}
                    close={this.handleTransactionClose}
                    showBalance={this.handleBalancesDisplay}
                    completeMessage={`Transfered ${this.state.transferAmount} ${this.state.transaction.token} Token(s)`}
                />

                <TransactionFail
                    fail={this.state.failed}
                    close={this.handleTransactionClose}
                    etherScanLink={this.state.transaction.etherScanLink}
                    token={this.state.transaction.token}
                    buyAmount={this.state.transferAmount}
                    errorMessage={this.state.transaction.error}
                />
            </Box>
        );
    }
}

export default Transfer;
