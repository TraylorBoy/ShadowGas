// vscode-fold=3
import React from 'react';
import { Text, Icon, Box } from 'rimble-ui';

/* -------------------------------------------------------------------------- */
/*                              Global Variables                              */
/* -------------------------------------------------------------------------- */

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

function Balances(props) {
    /* -------------------------------------------------------------------------- */
    /*                                    Props                                   */
    /* -------------------------------------------------------------------------- */

    const balances = props.balances;

    /* -------------------------------------------------------------------------- */
    /*                                   Render                                   */
    /* -------------------------------------------------------------------------- */

    return (
        <Box p={3} pl={0}>
            <div display='inline'>
                <Text
                    caps
                    fontSize={4}
                    fontWeight={4}
                    mb={3}
                    display={'flex'}
                    alignItems={'center'}
                    color={colors.text}
                >
                    <Icon name={'Eth'} mr={2} />
                    ETH: {balances.eth}
                </Text>
            </div>

            <div display='inline'>
                <Text
                    caps
                    fontSize={4}
                    fontWeight={4}
                    mb={3}
                    display={'flex'}
                    alignItems={'center'}
                    color={colors.text}
                >
                    <Icon name={'Generic'} mr={2} />
                    GST2: {balances.gst}
                </Text>
            </div>

            <div display='inline'>
                <Text
                    caps
                    fontSize={4}
                    fontWeight={4}
                    mb={3}
                    display={'flex'}
                    alignItems={'center'}
                    color={colors.text}
                >
                    <Icon name={'Generic'} mr={2} />
                    CHI: {balances.chi}
                </Text>
            </div>

            <div display='inline'>
                <Text
                    caps
                    fontSize={4}
                    fontWeight={4}
                    mb={3}
                    display={'flex'}
                    alignItems={'center'}
                    color={colors.text}
                >
                    <Icon name={'Generic'} mr={2} />
                    LGT: {balances.lgt}
                </Text>
            </div>
        </Box>
    );
}

export default Balances;
