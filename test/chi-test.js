const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    expect
} = require('chai');
const {
    Gas
} = require('../scripts/helpers/helper');
require('dotenv').config();

describe('Chi', () => {

    let ShadowGas;
    let chiToken;
    let gasLimit;
    let gasPrice;

    beforeEach(async () => {

        ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);
        chiToken = await bre.ethers.getContractAt('ChiToken', '0x0000000000004946c0e9F43F4Dee607b0eF1fA1c');

        let gasInfo = await Gas.etherScanTransaction();

        gasLimit = gasInfo.gasLimit;
        gasPrice = gasInfo.gasPrice;

    });

    describe('tankChi', () => {

        it('Should return the contract\'s Chi Balance', async () => {

            expect(parseInt(await ShadowGas.tankChi())).to.equal(parseInt(await chiToken.balanceOf(process.env.SHADOWGAS)));

        });

    });

    describe('refuelChi', () => {

        it('Should mint 1 Chi Token and store it at contract\'s address', async () => {

            const balBefore = parseInt(await ShadowGas.tankChi());

            await ShadowGas.refuelChi(1, {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            const balAfter = parseInt(await ShadowGas.tankChi());

            expect(balAfter).to.equal(balBefore + 1);

        });

    });

    describe('emptyChiTank', () => {

        it('Should mint and transfer 1 Chi from contract\'s Chi Balance to possessor', async () => {

            const balBefore = parseInt(await ShadowGas.tankChi());

            await ShadowGas.refuelChi(1, {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            const balAfter = parseInt(await ShadowGas.tankChi());

            expect(balAfter).to.equal(balBefore + 1);

            await ShadowGas.emptyChiTank(1, {
                gasLimit,
                gasPrice
            }).then(async (tx) => {

                await tx.wait();

            }).catch((err) => {

                console.error(err.message);

            });

            const balAfterEmpty = parseInt(await ShadowGas.tankChi());

            expect(balAfterEmpty).to.equal(balAfter - 1);

        });

    });

    describe('emptyChiTankTo', () => {

        it('Should mint and transfer 1 Chi from contract\'s Chi Balance to address', async () => {

            const balBefore = parseInt(await ShadowGas.tankChi());

            await ShadowGas.refuelChi(1, {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            const balAfter = parseInt(await ShadowGas.tankChi());

            expect(balAfter).to.equal(balBefore + 1);

            await ShadowGas.emptyChiTankTo(1, "0x6B8326c8b8B52b6F2b5cc020733E346e6d8c83aA", {
                gasLimit,
                gasPrice
            }).then(async (tx) => {

                await tx.wait();

            }).catch((err) => {

                console.error(err.message);

            });

            const balAfterEmpty = parseInt(await ShadowGas.tankChi());

            expect(balAfterEmpty).to.equal(balAfter - 1);

        });

    });


});