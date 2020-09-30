// vscode-fold=3
import React from 'react';
import ethers from 'ethers';
import { Box, Input, Flex, Button, Text } from 'rimble-ui';

import Gas from '../scripts/gas';

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
            shadow: props.shadow,
            isConnected: props.isConnected,
            updateBalance: props.updateBalance,
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
                });
            } else {
                throw new Error('Not a valid address');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    /* -------------------------------------------------------------------------- */
    /*                                  Transfer                                  */
    /* -------------------------------------------------------------------------- */

    transferChi = async () => {
        try {
            if (this.state.isConnected) {
                const amount = this.state.transferAmount;
                const address = this.state.transferAddress;

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
                            await tx.wait();
                        });

                    await this.state.updateBalance();
                } else if (ethers.utils.isAddress(address)) {
                    await this.state.shadow
                        .emptyChiTankTo(amount, address, {
                            gasLimit,
                            gasPrice,
                        })
                        .then(async (tx) => {
                            await tx.wait();
                        });

                    await this.state.updateBalance();
                } else {
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    transferLgt = async () => {
        try {
            if (this.state.isConnected) {
                const amount = this.state.transferAmount;
                const address = this.state.transferAddress;

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
                            await tx.wait();
                        });

                    await this.state.updateBalance();
                } else if (ethers.utils.isAddress(address)) {
                    await this.state.shadow
                        .emptyLgtTankTo(amount, address, {
                            gasLimit,
                            gasPrice,
                        })
                        .then(async (tx) => {
                            await tx.wait();
                        });

                    await this.state.updateBalance();
                } else {
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    transferGst = async () => {
        try {
            if (this.state.isConnected) {
                const amount = this.state.transferAmount / 10 ** 2;
                const address = this.state.transferAddress;

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
                            await tx.wait();
                        });

                    await this.state.updateBalance();
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
                            await tx.wait();
                        });

                    await this.state.updateBalance();
                } else {
                    throw new Error(
                        'Please enter a valid address or leave blank'
                    );
                }
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
                                onClick={this.transferGst}
                            >
                                GST2
                            </Button>
                        </Box>
                        <Box width={1 / 3}>
                            <Button
                                size='small'
                                icon='Generic'
                                mainColor={colors.element}
                                onClick={this.transferChi}
                            >
                                CHI
                            </Button>
                        </Box>
                        <Box width={1 / 3}>
                            <Button
                                size='small'
                                icon='Generic'
                                mainColor={colors.element}
                                onClick={this.transferLgt}
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
            </Box>
        );
    }
}

export default Transfer;
