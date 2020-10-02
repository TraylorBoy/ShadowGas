import React from 'react';
import { Box, Flex, Card, Modal, Button, Input, Text } from 'rimble-ui';

/* -------------------------------------------------------------------------- */
/*                              Global Variables                              */
/* -------------------------------------------------------------------------- */

const colors = {
    theme: '#252422',
    text: '#FFFFFF',
    container: '#262426',
    element: '#92537E',
};

function Trader(props) {
    let run = props.start;

    const oracle = props.oracle;

    return (
        <div>
            <Box>
                <Modal isOpen={run} width={'auto'}>
                    <Card width={'90%'} height={'90%'}>
                        <Box display='inline-block'>
                            <Button.Text
                                icononly
                                icon={'Close'}
                                color={'moon-gray'}
                                position={'absolute'}
                                top={0}
                                right={0}
                                onClick={props.stop}
                            />
                        </Box>

                        <Flex flexDirection='column'>
                            <Box
                                display='inline-block'
                                border={'1px solid'}
                                bg='black'
                                color={colors.text}
                            >
                                <Text.p textAlign='center'>Trader</Text.p>
                                <Text.p>{oracle.Log.Buy}</Text.p>
                                <Text.p>{oracle.Log.GasPrice}</Text.p>
                                <Text.p>{oracle.Log.GasCost}</Text.p>
                                <Text.p>{oracle.Log.WaitTime}</Text.p>
                                <Text.p>{oracle.Log.Profit}</Text.p>
                                <Text.p color='red'>
                                    {oracle.Log.Opportunity}
                                </Text.p>
                                <Text.p color='yellow'>
                                    Total Trades: {props.counter}
                                </Text.p>
                            </Box>
                        </Flex>
                    </Card>
                </Modal>
            </Box>
        </div>
    );
}

export default Trader;
