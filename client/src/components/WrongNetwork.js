import React from 'react';
import {
    Heading,
    Text,
    Flex,
    Modal,
    Box,
    Button,
    Card,
    Link,
    Icon,
} from 'rimble-ui';

function WrongNetwork(props) {
    return (
        <Modal isOpen={props.networkRequired}>
            <Card p={0} borderRadius={1}>
                <Flex
                    justifyContent='space-between'
                    alignItems='center'
                    borderBottom={1}
                    borderColor='near-white'
                    p={[3, 4]}
                    pb={3}
                >
                    <Heading
                        textAlign='center'
                        as='h1'
                        fontSize={[2, 3]}
                        px={[3, 0]}
                    >
                        Switch to the {props.networkName} Ethereum network
                    </Heading>
                    <Link>
                        <Icon
                            name='Close'
                            color='moon-gray'
                            aria-label='Close and cancel connection'
                            onClick={props.closeWrongNetwork}
                        />
                    </Link>
                </Flex>
                <Box p={[3, 4]}>
                    <Text textAlign='center'>
                        This dApp only works on the Kovan Ethereum test network.
                        You’re currently on <b>{props.networkName}</b>.
                    </Text>
                </Box>
                <Box px={[3, 4]} pb={[3, 4]}>
                    <Flex
                        flexDirection={['column', 'row']}
                        bg={'primary-2x-light'}
                        p={[3, 4]}
                        alignItems={['center', 'auto']}
                    >
                        <Flex
                            flexDirection='column'
                            alignItems={['center', 'flex-start']}
                        >
                            <Text fontWeight={4}>
                                Waiting for the right network...
                            </Text>
                            <Text fontWeight={2}>
                                Once you have switched, please close this window
                                and reconnect.
                            </Text>
                            <Button
                                mainColor={'red'}
                                onClick={props.closeWrongNetwork}
                            >
                                Close
                            </Button>
                        </Flex>
                    </Flex>
                </Box>
            </Card>
        </Modal>
    );
}

export default WrongNetwork;
