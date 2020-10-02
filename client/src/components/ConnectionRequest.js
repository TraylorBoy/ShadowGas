import React from 'react';
import {
    Heading,
    Text,
    Modal,
    Flex,
    Box,
    Loader,
    Card,
    Button,
    Image,
    Link,
    Icon,
} from 'rimble-ui';

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

function ConnectionRequest(props) {
    let open = props.openConnection;

    const confirmMetaMaskConnection = async () => {
        await props
            .confirmMetaMaskConnection()
            .then(() => {
                props.connectionFinish();
            })
            .catch((err) => {
                console.error(err.message);
            });
    };

    const confirmConnection = async () => {
        await props
            .confirmConnection()
            .then(() => {
                props.connectionFinish();
            })
            .catch((err) => {
                console.error(err.message);
            });
    };

    if (props.connectionType === 'MetaMask') {
        return (
            <Modal isOpen={open}>
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
                            Confirm connection
                        </Heading>
                        <Button.Text
                            icononly
                            icon={'Close'}
                            color={'moon-gray'}
                            position={'absolute'}
                            top={0}
                            right={0}
                            onClick={props.closeConnection}
                        />
                    </Flex>
                    <Box p={[3, 4]} textAlign='center'>
                        <Text.p>
                            Confirm the request that's just appeared. If you
                            can't see a request, open your wallet extension via
                            your browser.
                        </Text.p>
                        <Text.p>
                            After you have confirmed, please click the button
                            below to complete the connection.
                        </Text.p>
                        <Button
                            onClick={confirmMetaMaskConnection}
                            mainColor={colors.element}
                        >
                            Connect
                        </Button>
                    </Box>
                    <Box px={[3, 4]} pb={[3, 4]}>
                        <Flex
                            flexDirection={['column', 'row']}
                            bg={'primary-2x-light'}
                            p={[3, 4]}
                            alignItems={['center', 'auto']}
                        >
                            <Loader size={'3em'} mr={[0, 3]} mb={[2, 0]} />
                            <Flex
                                flexDirection='column'
                                alignItems={['center', 'flex-start']}
                            >
                                <Text fontWeight={4}>
                                    Waiting for connection confirmation...
                                </Text>
                                <Text fontWeight={2}>
                                    This won’t cost you any Ether
                                </Text>
                            </Flex>
                        </Flex>
                    </Box>
                </Card>
            </Modal>
        );
    } else {
    }

    return (
        <Modal isOpen={open} width={'auto'}>
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
                        Confirm connection
                    </Heading>
                    <Button.Text
                        icononly
                        icon={'Close'}
                        color={'moon-gray'}
                        position={'absolute'}
                        top={0}
                        right={0}
                        onClick={props.closeConnection}
                    />
                </Flex>
                <Box p={[3, 4]} textAlign='center'>
                    <Text>
                        <Text.p>
                            Please click the button below to complete the
                            connection.
                        </Text.p>
                    </Text>
                    <Button
                        onClick={confirmConnection}
                        mainColor={colors.element}
                    >
                        Connect
                    </Button>
                </Box>
                <Box px={[3, 4]} pb={[3, 4]}>
                    <Flex
                        flexDirection={['column', 'row']}
                        bg={'primary-2x-light'}
                        p={[3, 4]}
                        alignItems={['center', 'auto']}
                    >
                        <Loader size={'3em'} mr={[0, 3]} mb={[2, 0]} />
                        <Flex
                            flexDirection='column'
                            alignItems={['center', 'flex-start']}
                        >
                            <Text fontWeight={4}>
                                Waiting for connection confirmation...
                            </Text>
                            <Text fontWeight={2}>
                                This won’t cost you any Ether
                            </Text>
                        </Flex>
                    </Flex>
                </Box>
            </Card>
        </Modal>
    );
}

export default ConnectionRequest;
