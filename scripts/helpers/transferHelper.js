const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Gas = require('./gasHelper');
const Logger = require('./logHelper');
require('dotenv').config();

exports.emptyChiTank = async (amount) => {
    return new Promise(async (resolve, reject) => {

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const balBefore = parseInt(await ShadowGas.tankChi());

            Logger.talk(`Chi Balance: ${balBefore}`);

            if (balBefore > 0) {

                Logger.talk(`Emptying ${amount} CHI from tank`);

                const {
                    gasLimit,
                    gasPrice
                } = await Gas.etherScan();

                await ShadowGas.emptyChiTank(amount, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch(err => {

                    throw new Error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankChi());

                if (balAfter != balBefore - amount) throw new Error('CHI Balance did not change. Possible out of gas error, check etherscan or raise gas limit');

                Logger.talk(`Chi Balance: ${balAfter}`);

                Logger.talk(`Emptied ${amount} CHI from tank`);

                resolve(true);

            } else if (balBefore < amount) {

                throw new Error(`Not enough in tank to empty ${amount} CHI`);

            } else {

                Logger.talk(`Chi tank is empty`);

                resolve(true);
            }

        } catch (error) {

            reject(error);

        }

    });

};

exports.emptyChiTankTo = async (amount, address) => {
    return new Promise(async (resolve, reject) => {

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const balBefore = parseInt(await ShadowGas.tankChi());

            Logger.talk(`Chi Balance: ${balBefore}`);

            if (balBefore > 0) {

                Logger.talk(`Emptying ${amount} CHI from tank`);
                Logger.talk(`Sending ${amount} CHI to ${address}`);

                const {
                    gasLimit,
                    gasPrice
                } = await Gas.etherScan();

                await ShadowGas.emptyChiTankTo(amount, address, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch(err => {

                    throw new Error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankChi());

                if (balAfter != balBefore - amount) throw new Error('CHI Balance did not change. Possible out of gas error, check etherscan or raise gas limit');

                Logger.talk(`Chi Balance: ${balAfter}`);

                Logger.talk(`Emptied ${amount} CHI from tank`);
                Logger.talk(`Sent ${amount} CHI to ${address}`);

                resolve(true);

            } else if (balBefore < amount) {

                throw new Error(`Not enough in tank to empty ${amount} CHI`);

            } else {

                Logger.talk(`Chi tank is empty`);

                resolve(true);
            }

        } catch (error) {

            reject(error);

        }

    });

};

exports.emptyLgtTank = async (amount) => {
    return new Promise(async (resolve, reject) => {

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const balBefore = parseInt(await ShadowGas.tankLgt());

            Logger.talk(`Lgt Balance: ${balBefore}`);

            if (balBefore >= amount) {

                Logger.talk(`Emptying ${amount} LGT from tank`);

                const {
                    gasLimit,
                    gasPrice
                } = await Gas.etherScan();

                await ShadowGas.emptyLgtTank(amount, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch(err => {

                    throw new Error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankLgt());

                if (balAfter != balBefore - amount) throw new Error('LGT Balance did not change. Possible out of gas error, check etherscan or raise gas limit');

                Logger.talk(`Lgt Balance: ${balAfter}`);

                Logger.talk(`Emptied ${amount} LGT from tank`);

                resolve(true);

            } else if (balBefore < amount) {

                throw new Error(`Not enough in tank to empty ${amount} LGT`);

            } else {

                Logger.talk('Lgt tank is empty');

                resolve(true);

            }

        } catch (error) {

            reject(error);

        }

    });

};

exports.emptyLgtTankTo = async (amount, address) => {
    return new Promise(async (resolve, reject) => {

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const balBefore = parseInt(await ShadowGas.tankLgt());

            Logger.talk(`Lgt Balance: ${balBefore}`);

            if (balBefore >= amount) {

                Logger.talk(`Emptying ${amount} LGT from tank`);
                Logger.talk(`Sending ${amount} LGT to ${address}`);

                const {
                    gasLimit,
                    gasPrice
                } = await Gas.etherScan();

                await ShadowGas.emptyLgtTankTo(amount, address, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch(err => {

                    throw new Error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankLgt());

                if (balAfter != balBefore - amount) throw new Error('LGT Balance did not change. Possible out of gas error, check etherscan or raise gas limit');

                Logger.talk(`Lgt Balance: ${balAfter}`);

                Logger.talk(`Emptied ${amount} LGT from tank`);
                Logger.talk(`Sent ${amount} LGT to ${address}`);

                resolve(true);

            } else if (balBefore < amount) {

                throw new Error(`Not enough in tank to empty ${amount} LGT`);

            } else {

                Logger.talk('Lgt tank is empty');

                resolve(true);

            }

        } catch (error) {

            reject(error);

        }

    });

};

exports.emptyGstTank = async (amount) => {
    return new Promise(async (resolve, reject) => {

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const balBefore = (ethers.utils.formatUnits(await ShadowGas.tankGst(), 2)).toString();

            Logger.talk(`Gst Balance: ${balBefore}`);

            if (parseFloat(balBefore) >= parseFloat(amount)) {

                Logger.talk(`Emptying ${amount} Gst from tank`);

                const {
                    gasLimit,
                    gasPrice
                } = await Gas.etherScan();

                await ShadowGas.emptyGstTank(ethers.utils.parseUnits(amount, 2), {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch(err => {

                    throw new Error(err.message);

                });

                const balAfter = (ethers.utils.formatUnits(await ShadowGas.tankGst(), 2)).toString();

                if (parseFloat(balAfter) != parseFloat(balBefore) - parseFloat(amount)) throw new Error('Gst Balance did not change. Possible out of gas error, check etherscan or raise gas limit');

                Logger.talk(`Gst Balance: ${balAfter}`);

                Logger.talk(`Emptied ${amount} Gst from tank`);

                resolve(true);

            } else if (balBefore < amount) {

                throw new Error(`Not enough in tank to empty ${amount} GST`);

            } else {

                Logger.talk('GST tank is empty');

                resolve(true);

            }

        } catch (error) {

            reject(error);

        }

    });

};

exports.emptyGstTankTo = async (amount, address) => {
    return new Promise(async (resolve, reject) => {

        const ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        try {

            const balBefore = (ethers.utils.formatUnits(await ShadowGas.tankGst(), 2)).toString();

            Logger.talk(`Gst Balance: ${balBefore}`);

            if (parseFloat(balBefore) >= parseFloat(amount)) {

                Logger.talk(`Emptying ${amount} GST from tank`);
                Logger.talk(`Sending ${amount} GST to ${address}`);

                const {
                    gasLimit,
                    gasPrice
                } = await Gas.etherScan();

                await ShadowGas.emptyGstTankTo(ethers.utils.parseUnits(amount, 2), address, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch(err => {

                    throw new Error(err.message);

                });

                const balAfter = (ethers.utils.formatUnits(await ShadowGas.tankGst(), 2)).toString();

                if (parseFloat(balAfter) != parseFloat(balBefore) - parseFloat(amount)) throw new Error('Gst Balance did not change. Possible out of gas error, check etherscan or raise gas limit');

                Logger.talk(`Gst Balance: ${balAfter}`);

                Logger.talk(`Emptied ${amount} Gst from tank`);
                Logger.talk(`Sent ${amount} Gst to ${address}`);

                resolve(true);

            } else if (balBefore < amount) {

                throw new Error(`Not enough in tank to empty ${amount} Gst`);

            } else {

                Logger.talk('Gst tank is empty');

                resolve(true);

            }

        } catch (error) {

            reject(error);

        }

    });

};