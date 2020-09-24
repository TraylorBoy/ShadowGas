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

describe('Store', () => {

    let ShadowGas;
    let chiToken;
    let lgtToken;

    beforeEach(async () => {

        ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        lgtToken = await bre.ethers.getContractAt('ILGT', '0x000000000000C1CB11D5c062901F32D06248CE48');
        chiToken = await bre.ethers.getContractAt('ChiToken', '0x0000000000004946c0e9F43F4Dee607b0eF1fA1c');

    });

    describe('tankChi', () => {

        it('Should return the contract\'s Chi Balance', async () => {

            expect(parseInt(await ShadowGas.tankChi())).to.equal(parseInt(await chiToken.balanceOf(process.env.SHADOWGAS)));

        });

    });

    describe('tankLgt', () => {

        it('Should return the contract\'s Lgt Balance', async () => {

            expect(parseInt(await ShadowGas.tankLgt())).to.equal(parseInt(await lgtToken.balanceOf(process.env.SHADOWGAS)));

        });

    });

    describe('refuelChi', () => {

        it('Should mint 1 Chi Token and store it at contract\'s address', async () => {

            const balBefore = parseInt(await ShadowGas.tankChi());

            const {
                gasLimit,
                gasPrice
            } = await Gas.ethGasStation();

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

    describe('refuelLgt', () => {

        it('Should mint 1 lgt token and store it at contract\'s address', async () => {

            const balBefore = parseInt(await ShadowGas.tankLgt());

            const {
                gasLimit,
                gasPrice
            } = await Gas.ethGasStation();

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

});