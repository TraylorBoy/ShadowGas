// vscode-fold=3
import React from 'react';
import ethers from 'ethers';
import { Box, Input, Flex, Button, Text } from 'rimble-ui';

import Gas from '../scripts/gas';

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
            isConnected: props.isConnected,
            updateBalance: props.updateBalance,
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

    /* -------------------------------------------------------------------------- */
    /*                                    Store                                   */
    /* -------------------------------------------------------------------------- */

    storeChi = async () => {
        try {
            if (this.state.isConnected) {
                const amount = this.state.storeAmount;

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
                        await tx.wait();
                    });

                await this.state.updateBalance();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    storeLgt = async () => {
        try {
            if (this.state.isConnected) {
                const amount = this.state.storeAmount;

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
                        await tx.wait();
                    });

                await this.state.updateBalance();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    storeGst = async () => {
        try {
            if (this.state.isConnected) {
                const amount = this.state.storeAmount / 10 ** 2;

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
                        await tx.wait();
                    });

                await this.state.updateBalance();
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
                            onClick={this.storeGst}
                        >
                            GST2
                        </Button>
                    </Box>
                    <Box width={1 / 3}>
                        <Button
                            size='small'
                            icon='Generic'
                            mainColor={colors.element}
                            onClick={this.storeChi}
                        >
                            CHI
                        </Button>
                    </Box>
                    <Box width={1 / 3}>
                        <Button
                            size='small'
                            icon='Generic'
                            mainColor={colors.element}
                            onClick={this.storeLgt}
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
        );
    }
}

export default Store;
