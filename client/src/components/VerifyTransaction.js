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

function VerifyTransaction(props) {
    if (props.isDev) {
        return (
            <Modal isOpen={props.verify}>
                <Card borderRadius={1} p={0}>
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
                            Confirm your transaction
                        </Heading>
                        <Link onClick={props.cancelPurchase}>
                            <Icon
                                name='Close'
                                color='moon-gray'
                                aria-label='Close'
                            />
                        </Link>
                    </Flex>
                    <Box p={[3, 4]}>
                        <Flex
                            justifyContent={'space-between'}
                            flexDirection={'column'}
                        >
                            <Text textAlign='center'>
                                Double check the details here – your transaction
                                can't be refunded.
                            </Text>
                            <Flex
                                alignItems={'stretch'}
                                flexDirection={'column'}
                                borderRadius={2}
                                borderColor={'moon-gray'}
                                borderWidth={1}
                                borderStyle={'solid'}
                                overflow={'hidden'}
                                my={[3, 4]}
                            >
                                <Box bg={'primary'} px={3} py={2}>
                                    <Text color={'white'}>
                                        {props.buyAmount} {props.token} Token(s)
                                    </Text>
                                </Box>
                                <Flex
                                    p={3}
                                    borderBottom={'1px solid gray'}
                                    borderColor={'moon-gray'}
                                    alignItems={'center'}
                                    flexDirection={['column', 'row']}
                                >
                                    <Box
                                        position={'relative'}
                                        height={'2em'}
                                        width={'2em'}
                                        mr={[0, 3]}
                                        mb={[3, 0]}
                                    >
                                        <Box
                                            position={'absolute'}
                                            top={'0'}
                                            left={'0'}
                                        >
                                            <Loader size={'2em'} />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Text
                                            textAlign={['center', 'left']}
                                            fontWeight={'600'}
                                            fontSize={1}
                                            lineHeight={'1.25em'}
                                        >
                                            Waiting for confirmation...
                                        </Text>
                                        <Text
                                            fontWeight={100}
                                            lineHeight={'1.25em'}
                                            color={'primary'}
                                        >
                                            Click the Confirm Transaction button
                                            below
                                        </Text>
                                    </Box>
                                </Flex>
                                <Flex
                                    justifyContent={'space-between'}
                                    bg='light-gray'
                                    p={[2, 3]}
                                    borderBottom={'1px solid gray'}
                                    borderColor={'moon-gray'}
                                    flexDirection={['column', 'row']}
                                >
                                    <Text
                                        textAlign={['center', 'left']}
                                        color='near-black'
                                        fontWeight='bold'
                                    >
                                        Your account
                                    </Text>
                                    <Link
                                        href={props.etherScanLink}
                                        target={'_blank'}
                                    >
                                        <Tooltip message={props.address}>
                                            <Flex
                                                justifyContent={[
                                                    'center',
                                                    'auto',
                                                ]}
                                                alignItems={'center'}
                                                flexDirection='row-reverse'
                                            >
                                                <Text fontWeight='bold'>
                                                    {props.address}
                                                </Text>
                                                <Flex
                                                    mr={2}
                                                    p={1}
                                                    borderRadius={'50%'}
                                                    bg={'primary-extra-light'}
                                                    height={'2em'}
                                                    width={'2em'}
                                                    alignItems='center'
                                                    justifyContent='center'
                                                >
                                                    <Icon
                                                        color={'primary'}
                                                        name='RemoveRedEye'
                                                        size={'1em'}
                                                    />
                                                </Flex>
                                            </Flex>
                                        </Tooltip>
                                    </Link>
                                </Flex>
                                <Flex
                                    justifyContent={'space-between'}
                                    bg='near-white'
                                    py={[2, 3]}
                                    px={3}
                                    alignItems={'center'}
                                    borderBottom={'1px solid gray'}
                                    borderColor={'moon-gray'}
                                    flexDirection={['column', 'row']}
                                >
                                    <Text
                                        textAlign={['center', 'left']}
                                        color='near-black'
                                        fontWeight='bold'
                                    >
                                        Price
                                    </Text>
                                    <Flex
                                        alignItems={['center', 'flex-end']}
                                        flexDirection={['row', 'column']}
                                    >
                                        <Text
                                            mr={[2, 0]}
                                            color='near-black'
                                            fontWeight='bold'
                                            lineHeight={'1em'}
                                        >
                                            {props.costToMint} Eth
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Flex
                                    justifyContent={'space-between'}
                                    bg='light-gray'
                                    py={[2, 3]}
                                    px={3}
                                    alignItems={'center'}
                                    borderBottom={'1px solid gray'}
                                    borderColor={'moon-gray'}
                                    flexDirection={['column', 'row']}
                                >
                                    <Flex alignItems={'center'}>
                                        <Text
                                            textAlign={['center', 'left']}
                                            color='near-black'
                                            fontWeight='bold'
                                        >
                                            Transaction fee
                                        </Text>
                                        <Tooltip
                                            message='Pays the Ethereum network to process your transaction. Spent even if the transaction fails.'
                                            position='top'
                                        >
                                            <Icon
                                                ml={1}
                                                name={'InfoOutline'}
                                                size={'14px'}
                                                color={'primary'}
                                            />
                                        </Tooltip>
                                    </Flex>
                                    <Flex
                                        alignItems={['center', 'flex-end']}
                                        flexDirection={['row', 'column']}
                                    >
                                        <Text
                                            mr={[2, 0]}
                                            color='near-black'
                                            fontWeight='bold'
                                            lineHeight={'1em'}
                                        >
                                            {props.txCost} Eth
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Flex
                                    justifyContent={'space-between'}
                                    bg={'near-white'}
                                    p={[2, 3]}
                                    alignItems={'center'}
                                    flexDirection={['column', 'row']}
                                >
                                    <Text color='near-black' fontWeight='bold'>
                                        Estimated time
                                    </Text>
                                    <Text color={'mid-gray'}>
                                        {props.waitTime} Minutes
                                    </Text>
                                </Flex>
                            </Flex>
                            <Button
                                mb={3}
                                mainColor={colors.element}
                                onClick={() =>
                                    props.confirmPurchase(props.token)
                                }
                            >
                                Confirm Transaction
                            </Button>
                            <Button
                                mainColor={'red'}
                                onClick={props.cancelPurchase}
                            >
                                Close
                            </Button>
                        </Flex>
                    </Box>
                </Card>
            </Modal>
        );
    }

    return (
        <Modal isOpen={props.verify}>
            <Card borderRadius={1} p={0}>
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
                        Confirm your transaction
                    </Heading>
                    <Link onClick={props.cancelPurchase}>
                        <Icon
                            name='Close'
                            color='moon-gray'
                            aria-label='Close'
                        />
                    </Link>
                </Flex>
                <Box p={[3, 4]}>
                    <Flex
                        justifyContent={'space-between'}
                        flexDirection={'column'}
                    >
                        <Text textAlign='center'>
                            Double check the details here – your transaction
                            can't be refunded.
                        </Text>
                        <Flex
                            alignItems={'stretch'}
                            flexDirection={'column'}
                            borderRadius={2}
                            borderColor={'moon-gray'}
                            borderWidth={1}
                            borderStyle={'solid'}
                            overflow={'hidden'}
                            my={[3, 4]}
                        >
                            <Box bg={'primary'} px={3} py={2}>
                                <Text color={'white'}>
                                    {props.buyAmount} {props.token} Token(s)
                                </Text>
                            </Box>
                            <Flex
                                p={3}
                                borderBottom={'1px solid gray'}
                                borderColor={'moon-gray'}
                                alignItems={'center'}
                                flexDirection={['column', 'row']}
                            >
                                <Box
                                    position={'relative'}
                                    height={'2em'}
                                    width={'2em'}
                                    mr={[0, 3]}
                                    mb={[3, 0]}
                                >
                                    <Box
                                        position={'absolute'}
                                        top={'0'}
                                        left={'0'}
                                    >
                                        <Loader size={'2em'} />
                                    </Box>
                                </Box>
                                <Box>
                                    <Text
                                        textAlign={['center', 'left']}
                                        fontWeight={'600'}
                                        fontSize={1}
                                        lineHeight={'1.25em'}
                                    >
                                        Waiting for confirmation...
                                    </Text>
                                    <Link
                                        fontWeight={100}
                                        lineHeight={'1.25em'}
                                        color={'primary'}
                                        onClick={() =>
                                            this.props.confirmPurchase(
                                                this.props.token
                                            )
                                        }
                                    >
                                        Don't see the popup?
                                    </Link>
                                </Box>
                            </Flex>
                            <Flex
                                justifyContent={'space-between'}
                                bg='light-gray'
                                p={[2, 3]}
                                borderBottom={'1px solid gray'}
                                borderColor={'moon-gray'}
                                flexDirection={['column', 'row']}
                            >
                                <Text
                                    textAlign={['center', 'left']}
                                    color='near-black'
                                    fontWeight='bold'
                                >
                                    Your account
                                </Text>
                                <Link
                                    href={props.etherScanLink}
                                    target={'_blank'}
                                >
                                    <Tooltip message={props.address}>
                                        <Flex
                                            justifyContent={['center', 'auto']}
                                            alignItems={'center'}
                                            flexDirection='row-reverse'
                                        >
                                            <Text fontWeight='bold'>
                                                {props.address}
                                            </Text>
                                            <Flex
                                                mr={2}
                                                p={1}
                                                borderRadius={'50%'}
                                                bg={'primary-extra-light'}
                                                height={'2em'}
                                                width={'2em'}
                                                alignItems='center'
                                                justifyContent='center'
                                            >
                                                <Icon
                                                    color={'primary'}
                                                    name='RemoveRedEye'
                                                    size={'1em'}
                                                />
                                            </Flex>
                                        </Flex>
                                    </Tooltip>
                                </Link>
                            </Flex>
                            <Flex
                                justifyContent={'space-between'}
                                bg='near-white'
                                py={[2, 3]}
                                px={3}
                                alignItems={'center'}
                                borderBottom={'1px solid gray'}
                                borderColor={'moon-gray'}
                                flexDirection={['column', 'row']}
                            >
                                <Text
                                    textAlign={['center', 'left']}
                                    color='near-black'
                                    fontWeight='bold'
                                >
                                    Price
                                </Text>
                                <Flex
                                    alignItems={['center', 'flex-end']}
                                    flexDirection={['row', 'column']}
                                >
                                    <Text
                                        mr={[2, 0]}
                                        color='near-black'
                                        fontWeight='bold'
                                        lineHeight={'1em'}
                                    >
                                        {props.costToMint} Eth
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex
                                justifyContent={'space-between'}
                                bg='light-gray'
                                py={[2, 3]}
                                px={3}
                                alignItems={'center'}
                                borderBottom={'1px solid gray'}
                                borderColor={'moon-gray'}
                                flexDirection={['column', 'row']}
                            >
                                <Flex alignItems={'center'}>
                                    <Text
                                        textAlign={['center', 'left']}
                                        color='near-black'
                                        fontWeight='bold'
                                    >
                                        Transaction fee
                                    </Text>
                                    <Tooltip
                                        message='Pays the Ethereum network to process your transaction. Spent even if the transaction fails.'
                                        position='top'
                                    >
                                        <Icon
                                            ml={1}
                                            name={'InfoOutline'}
                                            size={'14px'}
                                            color={'primary'}
                                        />
                                    </Tooltip>
                                </Flex>
                                <Flex
                                    alignItems={['center', 'flex-end']}
                                    flexDirection={['row', 'column']}
                                >
                                    <Text
                                        mr={[2, 0]}
                                        color='near-black'
                                        fontWeight='bold'
                                        lineHeight={'1em'}
                                    >
                                        {props.txCost} Eth
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex
                                justifyContent={'space-between'}
                                bg={'near-white'}
                                p={[2, 3]}
                                alignItems={'center'}
                                flexDirection={['column', 'row']}
                            >
                                <Text color='near-black' fontWeight='bold'>
                                    Estimated time
                                </Text>
                                <Text color={'mid-gray'}>
                                    {props.waitTime} Minutes
                                </Text>
                            </Flex>
                        </Flex>
                        <Button
                            mainColor={'red'}
                            onClick={props.cancelPurchase}
                        >
                            Close
                        </Button>
                    </Flex>
                </Box>
            </Card>
        </Modal>
    );
}

export default VerifyTransaction;
