const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Logger = require('./logHelper');
const GasHelper = require('./gasHelper');
require('dotenv').config();

exports.walletBalance = async () => {

    [deployer] = await bre.ethers.getSigners();

    const bal = ethers.utils.formatEther((await deployer.getBalance()).toString());

    Logger.talk(`Wallet Balance: ${bal}`);

    return bal;

};

exports.tankBalances = () => {
    return new Promise(async (resolve, reject) => {
        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const chiBalance = parseInt(await ShadowGas.tankChi());
            const lgtBalance = parseInt(await ShadowGas.tankLgt());

            Logger.talk(`Chi Balance: ${chiBalance}`);
            Logger.talk(`Lgt Balance: ${lgtBalance}`);

            resolve({
                chiBalance,
                lgtBalance
            });

        } catch (error) {

            reject(new Error(error.message));

        }

    });
};

exports.tankChi = () => {
    return new Promise(async (resolve, reject) => {
        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const chiBalance = parseInt(await ShadowGas.tankChi());

            Logger.talk(`Chi Balance: ${chiBalance}`);

            resolve(chiBalance);

        } catch (error) {

            reject(new Error(error.message));

        }

    });
};

exports.tankLgt = () => {
    return new Promise(async (resolve, reject) => {
        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const lgtBalance = parseInt(await ShadowGas.tankLgt());

            Logger.talk(`Lgt Balance: ${lgtBalance}`);

            resolve(lgtBalance);

        } catch (error) {

            reject(new Error(error.message));

        }

    });
};

exports.refuelChi = (amount) => {
    return new Promise(async (resolve, reject) => {

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const balBefore = await this.tankChi();

            Logger.talk(`Refueling ${amount} CHI`);

            const {
                gasLimit,
                gasPrice
            } = await GasHelper.ethGasStation();

            await ShadowGas.refuelChi(amount, {
                gasLimit,
                gasPrice
            }).then(async tx => {

                await tx.wait();

            }).catch(err => {
                throw new Error(err.message);
            });

            const balAfter = await this.tankChi();

            if (balAfter <= balBefore) throw new Error('CHI Balance did not change. Possible out of gas error, check etherscan or raise gas limit');

            Logger.talk(`Refueled ${amount} CHI`);

            resolve(true);

        } catch (error) {
            reject(error);
        }

    });
};

exports.refuelLgt = (amount) => {
    return new Promise(async (resolve, reject) => {

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const balBefore = await this.tankLgt();

            Logger.talk(`Refueling ${amount} LGT`);

            const {
                gasLimit,
                gasPrice
            } = await GasHelper.ethGasStation();

            await ShadowGas.refuelLgt(amount, {
                gasLimit,
                gasPrice
            }).then(async tx => {

                await tx.wait();

            }).catch(err => {
                throw new Error(err.message);
            });

            const balAfter = await this.tankLgt();

            if (balAfter <= balBefore) throw new Error('LGT Balance did not change. Possible out of gas error, check etherscan or raise gas limit');

            Logger.talk(`Refueled ${amount} LGT`);

            resolve(true);

        } catch (error) {
            reject(error);
        }

    });
};