import React from 'react';
import {
    Box,
    Card,
    Flex,
    Icon,
    Heading,
    Link,
    Loader,
    Text,
    Modal,
    Tooltip,
    Button,
} from 'rimble-ui';

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

function TransactionComplete(props) {
    return (
        <Modal isOpen={props.complete}>
            <Card p={0} borderRadius={1} mb={4}>
                <Box
                    height='4px'
                    bg='success'
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
                    <Icon
                        name='CheckCircle'
                        color='success'
                        aria-label='Success'
                    />
                    <Heading
                        textAlign='center'
                        as='h1'
                        fontSize={[2, 3]}
                        px={[3, 0]}
                    >
                        {props.completeMessage}
                    </Heading>
                    <Link>
                        <Icon
                            name='Close'
                            color='moon-gray'
                            aria-label='Close and cancel connection'
                            onClick={() => props.close('complete')}
                        />
                    </Link>
                </Flex>
                <Box p={[3, 4]} pb={2}>
                    <Text textAlign='center' mt={2}>
                        Your transaction should now be finished.
                    </Text>
                    <Flex mt={4} justifyContent='center'>
                        <Card p={3} borderRadius={16}>
                            <Icon name='Generic' size='156px' />
                        </Card>
                    </Flex>
                </Box>
                <Flex
                    pt={2}
                    pb={4}
                    justifyContent='center'
                    flexDirection='column'
                >
                    <Heading textAlign='center' as='h4'>
                        {props.token}
                    </Heading>
                    <Link textAlign='center' href={props.etherScanLink}>
                        Show etherScan details
                    </Link>
                </Flex>

                <Flex
                    pt={[4, 4]}
                    pb={[4, 4]}
                    p={[3, 4]}
                    borderTop={1}
                    borderColor='near-white'
                    justifyContent='flex-end'
                    flexDirection='column'
                    alignItems='center'
                    textAlign='center'
                >
                    <Button
                        mainColor={colors.element}
                        width={['100%', 'auto']}
                        onClick={props.showBalance}
                        mb={3}
                    >
                        Show Balances
                    </Button>
                    <Button
                        mainColor={colors.element}
                        width={['100%', 'auto']}
                        onClick={() => props.close('complete')}
                    >
                        Close
                    </Button>
                </Flex>
            </Card>
        </Modal>
    );
}

export default TransactionComplete;
