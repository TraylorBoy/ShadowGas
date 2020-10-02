import React from 'react';
import {
    Heading,
    Text,
    Modal,
    Flex,
    Box,
    Button,
    Card,
    Icon,
    Link,
} from 'rimble-ui';

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

function ConnectionCancel(props) {
    return (
        <Modal isOpen={props.openConfirmation}>
            <Card p={0} borderRadius={1} mb={4}>
                <Box
                    height='4px'
                    bg='danger'
                    borderRadius={['1rem 1rem 0 0']}
                />
                <Flex
                    justifyContent='space-between'
                    alignItems='center'
                    borderBottom={1}
                    borderColor='near-white'
                    p={[3, 4]}
                    pb={3}
                >
                    <Icon name='Warning' color='danger' aria-label='Warning' />
                    <Heading
                        textAlign={['left', 'center']}
                        as='h1'
                        fontSize={[2, 3]}
                        px={[3, 0]}
                    >
                        Cancel connection?
                    </Heading>
                    <Link onClick={props.confirmClose}>
                        <Icon
                            name='Close'
                            color='moon-gray'
                            aria-label='Close and cancel connection'
                        />
                    </Link>
                </Flex>
                <Box p={[3, 4]}>
                    <Text>
                        To utilize the functionality of Light Station, you must
                        first connect your wallet.
                    </Text>
                </Box>
                <Flex
                    p={[3, 4]}
                    borderTop={1}
                    borderColor='near-white'
                    justifyContent='flex-end'
                    flexDirection={['column', 'row']}
                    alignItems='center'
                >
                    <Button.Outline
                        variant='danger'
                        mr={[0, 3]}
                        mb={[2, 0]}
                        width={['100%', 'auto']}
                        onClick={props.confirmClose}
                    >
                        Cancel connection
                    </Button.Outline>
                    <Button
                        width={['100%', 'auto']}
                        onClick={props.reOpenConnection}
                    >
                        Connect
                    </Button>
                </Flex>
            </Card>
        </Modal>
    );
}

export default ConnectionCancel;
