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

describe('Lgt', () => {

    let ShadowGas;
    let lgtToken;
    let gasLimit;
    let gasPrice;

    beforeEach(async () => {

        ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);
        lgtToken = await bre.ethers.getContractAt('ILGT', '0x000000000000C1CB11D5c062901F32D06248CE48');

        let gasInfo = await Gas.etherScanTransaction();

        gasLimit = gasInfo.gasLimit;
        gasPrice = gasInfo.gasPrice;

    });

    describe('tankLgt', () => {

        it('Should return the contract\'s Lgt Balance', async () => {

            expect(parseInt(await ShadowGas.tankLgt())).to.equal(parseInt(await lgtToken.balanceOf(process.env.SHADOWGAS)));

        });

    });

    describe('refuelLgt', () => {

        it('Should mint 1 Lgt Token and store it at contract\'s address', async () => {

            const balBefore = parseInt(await ShadowGas.tankLgt());

            await ShadowGas.refuelLgt(1, {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            const balAfter = parseInt(await ShadowGas.tankLgt());

            expect(balAfter).to.equal(balBefore + 1);

        });

    });

    describe('emptyLgtTank', () => {

        it('Should mint and transfer 1 Lgt from contract\'s Lgt Balance to possessor', async () => {

            const balBefore = parseInt(await ShadowGas.tankLgt());

            await ShadowGas.refuelLgt(1, {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            const balAfter = parseInt(await ShadowGas.tankLgt());

            expect(balAfter).to.equal(balBefore + 1);

            await ShadowGas.emptyLgtTank(1, {
                gasLimit,
                gasPrice
            }).then(async (tx) => {

                await tx.wait();

            }).catch((err) => {

                console.error(err.message);

            });

            const balAfterEmpty = parseInt(await ShadowGas.tankLgt());

            expect(balAfterEmpty).to.equal(balAfter - 1);

        });

    });

    describe('emptyLgtTankTo', () => {

        it('Should mint and transfer 1 Lgt from contract\'s Lgt Balance to address', async () => {

            const balBefore = parseInt(await ShadowGas.tankLgt());

            await ShadowGas.refuelLgt(1, {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            const balAfter = parseInt(await ShadowGas.tankLgt());

            expect(balAfter).to.equal(balBefore + 1);

            await ShadowGas.emptyLgtTankTo(1, "0x6B8326c8b8B52b6F2b5cc020733E346e6d8c83aA", {
                gasLimit,
                gasPrice
            }).then(async (tx) => {

                await tx.wait();

            }).catch((err) => {

                console.error(err.message);

            });

            const balAfterEmpty = parseInt(await ShadowGas.tankLgt());

            expect(balAfterEmpty).to.equal(balAfter - 1);

        });

    });


});