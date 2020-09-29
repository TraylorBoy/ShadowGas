import React from 'react';
import { Flex, Text, Icon, Tooltip, Box } from 'rimble-ui';

function Network(props) {
    const networkName = props.networkName;

    if (networkName !== 'KOVAN') {
        return (
            <Box p={3}>
                <Flex flexDirection="column">
                    <Text fontSize={1} color="silver" caps>
                    Current Network
                    </Text>
                    <Tooltip message="You're on the wrong network – please switch to the Kovan Test Network">
                        <Flex>
                            <Text mr={2} color='white'>{networkName}</Text>
                            <Icon name="Error" color="danger" />
                        </Flex>
                    </Tooltip>
                </Flex>
            </Box>       
        )
    }

    return (
        <Box p={3}>
            <Flex flexDirection="column">
                <Text fontSize={1} color="silver" caps>
                Current Network
                </Text>
                <Tooltip message="You're on the right network">
                    <Flex>
                        <Text mr={2} color='white'>{networkName}</Text>
                        <Icon name="CheckCircle" color="success" />
                    </Flex>
                </Tooltip>
            </Flex>
        </Box>
    )
}

export default Network;