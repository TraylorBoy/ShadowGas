const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    expect
} = require('chai');
const {
    GasHelper
} = require('../scripts/helpers/helper');
const {
    lgt
} = require('../scripts/helpers/gasToken');
require('dotenv').config();

describe('Transfer', () => {

    let ShadowGas;
    let chiToken;
    let lgtToken;

    beforeEach(async () => {

        ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        lgtToken = await bre.ethers.getContractAt('ILGT', '0x000000000000C1CB11D5c062901F32D06248CE48');
        chiToken = await bre.ethers.getContractAt('ChiToken', '0x0000000000004946c0e9F43F4Dee607b0eF1fA1c');

    });

    describe('emptyChiTank', () => {

        it('Should transfer the contract\'s Chi Balance to possessor', async () => {


            let chiBalance = parseInt(await ShadowGas.tankChi());

            const {
                gasLimit,
                gasPrice
            } = await GasHelper.ethGasStation();

            if (chiBalance > 0) {

                await ShadowGas.emptyChiTank(chiBalance, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch((err) => {

                    console.error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankChi());

                expect(balAfter).to.equal(0.0);

            } else {

                await ShadowGas.refuelChi(1, {

                    gasLimit,
                    gasPrice

                }).then(async (tx) => {

                    await tx.wait();

                });

                chiBalance = parseInt(await ShadowGas.tankChi());

                await ShadowGas.emptyChiTank(chiBalance, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch((err) => {

                    console.error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankChi());

                expect(balAfter).to.equal(0.0);


            }


        });

    });

    describe('emptyLgtTank', () => {

        it('Should transfer the contract\'s Lgt Balance to possessor', async () => {


            let lgtBalance = parseInt(await ShadowGas.tankLgt());

            const {
                gasLimit,
                gasPrice
            } = await GasHelper.ethGasStation();

            if (lgtBalance > 0) {

                await ShadowGas.emptyLgtTank(lgtBalance, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch((err) => {

                    console.error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankLgt());

                expect(balAfter).to.equal(0.0);

            } else {

                await ShadowGas.refuelLgt(1, {

                    gasLimit,
                    gasPrice

                }).then(async (tx) => {

                    await tx.wait();

                });

                lgtBalance = parseInt(await ShadowGas.tankLgt());

                await ShadowGas.emptyLgtTank(lgtBalance, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch((err) => {

                    console.error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankLgt());

                expect(balAfter).to.equal(0.0);


            }


        });

    });

    describe('emptyChiTankTo', () => {

        it('Should transfer the contract\'s Chi Balance to address', async () => {


            let chiBalance = parseInt(await ShadowGas.tankChi());
            const receiverBalBefore = parseInt(await chiToken.balanceOf(process.env.WALLET));

            const {
                gasLimit,
                gasPrice
            } = await GasHelper.ethGasStation();

            if (chiBalance > 0) {

                await ShadowGas.emptyChiTankTo(chiBalance, process.env.WALLET, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch((err) => {

                    console.error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankChi());

                expect(balAfter).to.equal(0.0);

                const receiverBal = parseInt(await chiToken.balanceOf(process.env.WALLET));

                expect(receiverBal).to.equal(receiverBalBefore + chiBalance);

            } else {

                await ShadowGas.refuelChi(1, {

                    gasLimit,
                    gasPrice

                }).then(async (tx) => {

                    await tx.wait();

                });

                chiBalance = parseInt(await ShadowGas.tankChi());

                await ShadowGas.emptyChiTankTo(chiBalance, process.env.WALLET, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch((err) => {

                    console.error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankChi());

                expect(balAfter).to.equal(0.0);

                const receiverBal = parseInt(await chiToken.balanceOf(process.env.WALLET));

                expect(receiverBal).to.equal(receiverBalBefore + chiBalance);


            }


        });

    });

    describe('emptyLgtTankTo', () => {

        it('Should transfer the contract\'s Lgt Balance to address', async () => {


            let lgtBalance = parseInt(await ShadowGas.tankLgt());
            const receiverBalBefore = parseInt(await lgtToken.balanceOf(process.env.WALLET));

            const {
                gasLimit,
                gasPrice
            } = await GasHelper.ethGasStation();

            if (lgtBalance > 0) {

                await ShadowGas.emptyLgtTankTo(lgtBalance, process.env.WALLET, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch((err) => {

                    console.error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankLgt());

                expect(balAfter).to.equal(0.0);

                const receiverBal = parseInt(await lgtToken.balanceOf(process.env.WALLET));

                console.log(receiverBal);

                expect(receiverBal).to.equal(receiverBalBefore + lgtBalance);

            } else {

                await ShadowGas.refuelLgt(1, {

                    gasLimit,
                    gasPrice

                }).then(async (tx) => {

                    await tx.wait();

                });

                lgtBalance = parseInt(await ShadowGas.tankLgt());

                await ShadowGas.emptyLgtTankTo(lgtBalance, process.env.WALLET, {
                    gasLimit,
                    gasPrice
                }).then(async (tx) => {

                    await tx.wait();

                }).catch((err) => {

                    console.error(err.message);

                });

                const balAfter = parseInt(await ShadowGas.tankLgt());

                expect(balAfter).to.equal(0.0);

                const receiverBal = parseInt(await lgtToken.balanceOf(process.env.WALLET));

                expect(receiverBal).to.equal(receiverBalBefore + lgtBalance);

            }


        });

    });


});