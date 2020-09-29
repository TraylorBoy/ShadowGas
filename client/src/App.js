import React from 'react';
import ethers from 'ethers';
import { Flex, Box, Heading, Text, Card, Button, MetaMaskButton, Icon } from 'rimble-ui';

import Connect from './scripts/connect';

import Network from './components/Network';
import Connected from './components/Connected';

import './App.css';

const colors = {
  theme: '#252422',
  text: '#FFFFFF',
  container: '#262426',
  element: '#92537E'
};

class App extends React.Component{

/* -------------------------------------------------------------------------- */

  state = {
    shadow: null,
    wallet: null,
    walletAddress: '',
    balance: {
      eth: 0,
      gst: 0,
      lgt: 0,
      chi: 0
    },
    network: 'Not Connected',
    isConnected: false,
    task: 'Connect'
  };

/* -------------------------------------------------------------------------- */

  handleConnect = async () => {
    
    try {

      const _wallet = await Connect.connectWallet();
      const _walletAddress = await _wallet.getAddress();
      const _network = await _wallet.provider.getNetwork();
      const _shadow = await Connect.connectShadow(_wallet);

      this.setState(state => ({
        shadow: _shadow,
        wallet: _wallet,
        walletAddress: _walletAddress,
        isConnected: true,
        network: _network.name.toUpperCase()
      }));

    } catch (error) {

      console.error(error.message);

    }

  }

  handleMetaMaskConnect = async () => {
    
    try {

      const metaMask = await Connect.connectMetaMask();

      const _wallet = await metaMask.getSigner();
      const _walletAddress = await _wallet.getAddress();
      const _network = await metaMask.getNetwork();
      const _shadow = await Connect.connectShadow(_wallet);

      this.setState(state => ({
        shadow: _shadow,
        wallet: _wallet,
        walletAddress: _walletAddress,
        isConnected: true,
        network: _network.name.toUpperCase()
      }));

    } catch (error) {

      console.error(error.message);

    }

  }

  connectTask = () => { this.setState(state => ({ task: 'Connect' })); }

  balancesTask = async () => {

    if (this.state.isConnected) {

      try {

        const gstBalance = ethers.utils.formatUnits(await this.state.shadow.tankGst(), 2);
        const chiBalance = parseInt(await this.state.shadow.tankChi());
        const lgtBalance = parseInt(await this.state.shadow.tankLgt());
        const ethBalance = parseFloat(ethers.utils.formatEther(await this.state.wallet.getBalance())).toFixed(6);

        this.setState(state => ({
          balance: {
            gst: gstBalance,
            chi: chiBalance,
            lgt: lgtBalance,
            eth: ethBalance
          },
          task: 'Balances'
        }));

      } catch (error) {
      
        console.error(error.message);

      }

    } else {

      this.setState(state => ({
        task: 'Balances'
      }));

    }

  }

  storeTask = () => { this.setState(state => ({ task: 'Store' })); }
  transferTask = () => { this.setState(state => ({ task: 'Transfer' })); }
  tradeTask = () => { this.setState(state => ({ task: 'Trade' })); }

/* -------------------------------------------------------------------------- */

  render() {
    return (
      <div id='app'>

        {/* -------------------------------------------------------------------------- */}

        <Flex id='status'>

          <Box>
            <Network networkName={this.state.network}></Network>
          </Box>
          
          <Box>
            <Connected isConnected={this.state.isConnected} address={this.state.walletAddress}></Connected>
          </Box>

        </Flex>

        {/* -------------------------------------------------------------------------- */}

        <div id='content-wrap'>

          <Card p={3} border='0px' borderRadius='5px' width={'auto'} m={'auto'} maxWidth={'420px'} bg={colors.container}>
            <Flex>

              <Box ml={0} p={3} borderRight='1px solid'>

                <Button icononly={true} size='small' icon='AccountBalanceWallet' mainColor={colors.element} onClick={this.connectTask}></Button>
                <Text mb={3}>Connect</Text>
                <Button icononly={true} size='small' icon='MonetizationOn' mainColor={colors.element} onClick={this.balancesTask}></Button>
                <Text mb={3}>Balances</Text>
                <Button icononly={true} size='small' icon='FileUpload' mainColor={colors.element} onClick={this.storeTask}></Button>
                <Text mb={3}>Store</Text>
                <Button icononly={true} size='small' icon='SwapVert' mainColor={colors.element} onClick={this.transferTask}></Button>
                <Text mb={3}>Transfer</Text>
                <Button icononly={true} size='small' icon='Assessment' mainColor={colors.element} onClick={this.tradeTask}></Button>
                <Text mb={3}>Trade</Text>
              </Box>

              {/* -------------------------------------------------------------------------- */}

              <Flex flexDirection='column'>

                <Box p={1} borderBottom='1px solid'>
                  <Heading color={colors.text}>Light Station</Heading>

                  <Box>
                    <Text color={colors.text}>Stores, Transfers, and Trades Ethereum Gas Tokens</Text>
                  </Box>

                </Box>

                {/* -------------------------------------------------------------------------- */}

                {this.state.task === 'Connect' && !this.state.isConnected &&
                  
                  <Box p={3}>
                  
                    <Heading pl={0}>Connect</Heading>
                  
                    <Box>
                  
                      <Text.p color={colors.text}>Connect to your wallet defined in your '.env.local' file by pressing the button below</Text.p>
                      <Box textAlign='center'><Button icon='AccountBalanceWallet' mainColor={colors.element} onClick={this.handleConnect}>Connect</Button></Box>

                      <Text.p color={colors.text}>You may also connect with your MetaMask wallet</Text.p>
                      <Box textAlign='center'><MetaMaskButton.Outline mainColor={colors.element} onClick={this.handleMetaMaskConnect} >Connect with MetaMask</MetaMaskButton.Outline></Box>

                    </Box>
                  </Box>
                }

                {this.state.task === 'Connect' && this.state.isConnected &&

                  <Box p={3}>
                  
                    <Heading>Wallet Connected</Heading>
                  
                    <Box textAlign='center'>
                  
                      <Icon name="CheckCircle" color="success" size='150' />

                    </Box>
                  </Box>
                }

                {/* -------------------------------------------------------------------------- */}
                
                {this.state.task === 'Balances' &&
                
                  <Box p={3}>
                    <Heading>Balances</Heading>

                    <Box display="inline">
                      <Text
                        caps
                        fontSize={4}
                        fontWeight={4}
                        mb={3}
                        display={"flex"}
                        alignItems={"center"}
                        color={colors.text}
                      >
                        <Icon name={"Eth"} mr={2} />
                        ETH: {this.state.balance.eth}
                      </Text>
                    </Box>

                    <Box display="inline">
                      <Text
                        caps
                        fontSize={4}
                        fontWeight={4}
                        mb={3}
                        display={"flex"}
                        alignItems={"center"}
                        color={colors.text}
                      >
                        <Icon name={"Generic"} mr={2} />
                        GST2: {this.state.balance.gst}
                      </Text>
                    </Box>
                  
                    <Box display="inline">
                      <Text
                        caps
                        fontSize={4}
                        fontWeight={4}
                        mb={3}
                        display={"flex"}
                        alignItems={"center"}
                        color={colors.text}
                      >
                        <Icon name={"Generic"} mr={2} />
                        CHI: {this.state.balance.chi}
                      </Text>
                    </Box>
                  
                    <Box display="inline">
                      <Text
                        caps
                        fontSize={4}
                        fontWeight={4}
                        mb={3}
                        display={"flex"}
                        alignItems={"center"}
                        color={colors.text}
                      >
                        <Icon name={"Generic"} mr={2} />
                        LGT: {this.state.balance.lgt}
                      </Text>
                    </Box>

                  </Box>
                  
                }

                {/* -------------------------------------------------------------------------- */}

                {this.state.task === 'Store' &&
                
                  <Box>
                    <Heading>TODO: Store</Heading>
                  </Box>
                  
                }

                {/* -------------------------------------------------------------------------- */}

                {this.state.task === 'Transfer' &&
                
                  <Box>
                    <Heading>TODO: Transfer</Heading>
                  </Box>
                  
                }

                {/* -------------------------------------------------------------------------- */}

                {this.state.task === 'Trade' &&
                
                  <Box>
                    <Heading>TODO: Trade</Heading>
                  </Box>
                  
                }

              </Flex>

            </Flex>
          </Card>
        </div>

      </div>
    );
  }
}

export default App;
