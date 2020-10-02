import Web3 from 'web3';
import ethers from 'ethers';
import ShadowGasAbi from './abi/ShadowGas';

/* -------------------------------------------------------------------------- */
/*                                  Connect                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------- Metamask -------------------------------- */

const connectMetaMask = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            // MetaMask installed?
            if (window.ethereum) {
                await window.ethereum.enable(); // Ask to connect

                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                );

                resolve(provider);
            }
            // Other browser wallets
            else if (window.web3) {
                const provider = new ethers.providers.Web3Provider(
                    window.web3.currentProvider
                );

                resolve(provider);
            }
            // If all else fails...
            else {
                const provider = new ethers.providers.Web3Provider(
                    new Web3.providers.WebsocketProvider('ws://localhost:8546')
                );

                resolve(provider);
            }
        } catch (error) {
            reject(error);
        }
    });
};

/* --------------------------------- JsonRpc -------------------------------- */
// REACT_APP_ environment variables are located in the your .env.local file (create one if you didn't already!)

const connectWallet = async () => {
    return new Promise(async (resolve, reject) => {
        const provider = new ethers.providers.JsonRpcProvider(
            process.env.REACT_APP_KOVAN || 'http://localhost:8545'
        );

        resolve(
            new ethers.Wallet(`0x${process.env.REACT_APP_PRIVATEKEY}`, provider)
        );
    });
};

/* -------------------------------- Contract -------------------------------- */

const connectShadow = async (possessor) => {
    return new ethers.Contract(
        process.env.REACT_APP_SHADOWGAS,
        ShadowGasAbi,
        possessor
    );
};

export default {
    connectWallet,
    connectMetaMask,
    connectShadow,
};
