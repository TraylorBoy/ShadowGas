import React from 'react';
import {
    Box,
    Text,
    Button,
    MetaMaskButton,
    Icon,
    Modal,
    Card,
    Flex,
    Heading,
    Link,
} from 'rimble-ui';

import Init from '../scripts/init';

import ConnectionRequest from './ConnectionRequest';
import ConnectionCancel from './ConnectionCancel';

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

class Connect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shouldRequest: false,
            confirmClose: false,
            didConnect: props.isConnected,
            connectType: '',
        };
    }

    handleConnect = async () => {
        try {
            const _wallet = await Init.connectWallet();
            const _walletAddress = await _wallet.getAddress();
            const _network = await _wallet.provider.getNetwork();
            const _shadow = await Init.connectShadow(_wallet);

            this.props.connectionRequest(
                _wallet,
                _walletAddress,
                _network,
                _shadow,
                true
            );
        } catch (error) {
            console.error(error.message);
        }
    };

    handleMetaMaskConnect = async () => {
        try {
            const metaMask = await Init.connectMetaMask();

            const _wallet = await metaMask.getSigner();
            const _walletAddress = await _wallet.getAddress();
            const _network = await metaMask.getNetwork();
            const _shadow = await Init.connectShadow(_wallet);

            this.props.connectionRequest(
                _wallet,
                _walletAddress,
                _network,
                _shadow,
                false
            );
        } catch (error) {
            console.error(error.message);
        }
    };

    closeRequest = () => {
        this.setState({
            shouldRequest: false,
            didConnect: this.props.isConnected,
        });
    };

    confirmRequestClose = () => {
        this.setState({
            confirmClose: false,
        });

        this.closeRequest();
    };

    confirmRequestReOpen = () => {
        this.setState({
            shouldRequest: true,
            confirmClose: false,
        });
    };

    openConfirmation = () => {
        if (!this.state.didConnect) {
            this.setState({
                confirmClose: true,
            });
        }
    };

    openWalletRequest = () => {
        if (!this.state.didConnect) {
            this.setState({
                shouldRequest: true,
                connectType: 'Wallet',
            });
        }

        if (this.props.connectionRequired) {
            this.props.closeRequired();
        }
    };

    openMetaMaskRequest = () => {
        if (!this.state.didConnect) {
            this.setState({
                shouldRequest: true,
                connectType: 'MetaMask',
            });
        }

        if (this.props.connectionRequired) {
            this.props.closeRequired();
        }
    };

    render() {
        return (
            <div>
                {!this.state.didConnect && (
                    <Box textAlign='center'>
                        <Box textAlign='center' pb={3}>
                            <Text.p color={colors.text}>
                                MetaMask Browser Wallet
                            </Text.p>
                            <MetaMaskButton.Outline
                                mainColor={colors.element}
                                onClick={this.openMetaMaskRequest}
                            >
                                Connect with MetaMask
                            </MetaMaskButton.Outline>
                        </Box>

                        {/*<Text.p color={colors.text}>
                            Other Browser Wallets
                        </Text.p>
                        <Box textAlign='center' pb={3}>
                            <Button
                                icon='AccountBalanceWallet'
                                mainColor={colors.element}
                                onClick={this.openMetaMaskRequest}
                            >
                                    Crypto Wallet
                            </Button>
                        </Box>

                        <Text.p color={colors.text}>Ethers Wallet</Text.p>
                        <Box pb={3}>
                            <Link
                                href='https://github.com/TraylorBoy/ShadowGas'
                                target='_blank'
                                title='Documentation for ShadowGas and Light Station UI'
                            >
                                    Click here to read the documentation
                            </Link>
                        </Box>
                        <Box textAlign='center'>
                            <Button
                                icon='AccountBalanceWallet'
                                mainColor={'blue'}
                                onClick={this.openWalletRequest}
                            >
                                    Dev Wallet
                            </Button>
                        </Box>*/}

                        <ConnectionRequest
                            closeConnection={this.openConfirmation}
                            openConnection={this.state.shouldRequest}
                            connectionFinish={this.closeRequest}
                            connectionType={this.state.connectType}
                            confirmConnection={this.handleConnect}
                            confirmMetaMaskConnection={
                                this.handleMetaMaskConnect
                            }
                        ></ConnectionRequest>

                        <ConnectionCancel
                            reOpenConnection={this.confirmRequestReOpen}
                            confirmClose={this.confirmRequestClose}
                            openConfirmation={this.state.confirmClose}
                        />
                    </Box>
                )}

                {this.state.didConnect && (
                    <Box p={3}>
                        <Box textAlign='center'>
                            <Icon
                                name='CheckCircle'
                                color='success'
                                size='150'
                            />
                        </Box>
                    </Box>
                )}

                {this.props.connectionRequired && (
                    <Box>
                        <Modal isOpen={this.props.connectionRequired}>
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
                                    <Icon
                                        name='Warning'
                                        color='danger'
                                        aria-label='Warning'
                                    />
                                    <Heading
                                        textAlign={['left', 'center']}
                                        as='h1'
                                        fontSize={[2, 3]}
                                        px={[3, 0]}
                                    >
                                        Connection Required
                                    </Heading>
                                    <Link onClick={this.props.closeRequired}>
                                        <Icon
                                            name='Close'
                                            color='moon-gray'
                                            aria-label='Close and cancel connection'
                                        />
                                    </Link>
                                </Flex>
                                <Box p={[3, 4]}>
                                    <Text.p textAlign='center'>
                                        To utilize the functionality of Light
                                        Station, you must first connect your
                                        wallet.
                                    </Text.p>
                                </Box>
                                <Flex
                                    p={[3, 4]}
                                    borderTop={1}
                                    borderColor='near-white'
                                    justifyContent='flex-end'
                                    flexDirection={'column'}
                                    alignItems='center'
                                >
                                    <Box textAlign='center' pb={3}>
                                        <MetaMaskButton.Outline
                                            mainColor={colors.element}
                                            onClick={this.openMetaMaskRequest}
                                        >
                                            Connect with MetaMask
                                        </MetaMaskButton.Outline>
                                    </Box>

                                    <Box textAlign='center' pb={3}>
                                        <Button
                                            icon='AccountBalanceWallet'
                                            mainColor={colors.element}
                                            onClick={this.openMetaMaskRequest}
                                        >
                                            Connect
                                        </Button>
                                    </Box>

                                    <Box textAlign='center' pb={3}>
                                        <Button
                                            icon='AccountBalanceWallet'
                                            mainColor={'blue'}
                                            onClick={this.openWalletRequest}
                                        >
                                            Dev Wallet
                                        </Button>
                                    </Box>

                                    <Box textAlign='center'>
                                        <Button
                                            mainColor={'red'}
                                            onClick={this.props.closeRequired}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Flex>
                            </Card>
                        </Modal>
                    </Box>
                )}
            </div>
        );
    }
}

export default Connect;
