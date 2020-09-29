import Web3 from 'web3';
import ethers from 'ethers';
import ShadowGasAbi from './abi/ShadowGas';

const connectMetaMask = async () => {
    return new Promise(async (resolve, reject) => {

        try {

            if (window.ethereum) {

                await window.ethereum.enable();

                const provider = new ethers.providers.Web3Provider(window.ethereum);

                resolve(provider);
            }


        } catch (error) {

            reject(error);

        }

    });
};

const connectWallet = async () => {
    
    return new Promise(async (resolve, reject) => {

        const provider = new ethers.providers.JsonRpcProvider(

            process.env.REACT_APP_KOVAN || "http://localhost:8545",
            
        );

        resolve(new ethers.Wallet(
            `0x${process.env.REACT_APP_PRIVATEKEY}`,
            provider
        ));

    });

};

const connectShadow = async (possessor) => {

    return new ethers.Contract(process.env.REACT_APP_SHADOWGAS, ShadowGasAbi, possessor);

};

export default {
    connectWallet,
    connectMetaMask,
    connectShadow
};