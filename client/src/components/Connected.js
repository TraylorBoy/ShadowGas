// vscode-fold=3
import React from 'react';
import { Flex, Text, Icon, Tooltip, Box } from 'rimble-ui';

function Connected(props) {
    /* -------------------------------------------------------------------------- */
    /*                                    Props                                   */
    /* -------------------------------------------------------------------------- */

    const connected = props.isConnected;
    const address = props.address;

    /* -------------------------------------------------------------------------- */
    /*                                   Render                                   */
    /* -------------------------------------------------------------------------- */

    if (!connected) {
        return (
            <Box p={3}>
                <Flex flexDirection='column'>
                    <Text fontSize={1} color='silver' caps>
                        Wallet
                    </Text>
                    <Tooltip message='Please connect your wallet before using the app'>
                        <Flex>
                            <Text mr={2} color='white'>
                                {address}
                            </Text>
                            <Icon name='Error' color='danger' />
                        </Flex>
                    </Tooltip>
                </Flex>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Flex flexDirection='column'>
                <Text fontSize={1} color='silver' caps>
                    Wallet
                </Text>
                <Tooltip message='Your wallet is connected'>
                    <Flex>
                        <Text mr={2} color='white'>
                            {address}
                        </Text>
                        <Icon name='CheckCircle' color='success' />
                    </Flex>
                </Tooltip>
            </Flex>
        </Box>
    );
}

export default Connected;
