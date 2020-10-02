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

function TransactionFailed(props) {
    return (
        <Modal isOpen={props.fail}>
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
                        textAlign='center'
                        as='h1'
                        fontSize={[2, 3]}
                        px={[3, 0]}
                    >
                        Transaction Failed
                    </Heading>
                    <Link>
                        <Icon
                            name='Close'
                            color='moon-gray'
                            aria-label='Close and cancel connection'
                            onClick={() => props.close('fail')}
                        />
                    </Link>
                </Flex>
                <Text p={[3, 4]}>
                    Your transaction has failed. Possible reasons as to why your
                    transaction my have failed:
                </Text>
                <Box>
                    <ol>
                        <li>Out of gas (Raise your gas limit!)</li>
                        <li>Gas Price is too low (Raise your gas price!)</li>
                        <li>
                            Not enough eth (Transfer some ETH to your wallet!)
                        </li>
                    </ol>
                </Box>
                <Text p={[3, 4]}>{props.errorMessage}</Text>
                <Flex
                    p={[3, 4]}
                    borderTop={1}
                    borderColor='near-white'
                    justifyContent='flex-end'
                    flexDirection={'column'}
                    alignItems='center'
                    textAlign='center'
                >
                    <Button
                        as={'a'}
                        mainColor={colors.element}
                        href={props.etherScanLink}
                        mb={3}
                    >
                        View on Etherscan
                    </Button>
                    <Button
                        mainColor={'red'}
                        onClick={() => props.close('fail')}
                    >
                        Close
                    </Button>
                </Flex>
            </Card>
        </Modal>
    );
}

export default TransactionFailed;
