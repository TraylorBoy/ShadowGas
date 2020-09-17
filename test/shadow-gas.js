const {
    expect
} = require('chai');
const {
    ethers
} = require('ethers');
require('dotenv').config();

const bre = require('@nomiclabs/buidler');

// Test on testnet
// If a function fails, check etherscan
// tx might have not gone through before balance was checked

describe('Contract Shadow Gas', () => {

    let ShadowGas;

    beforeEach(async () => {

        ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

    });

    describe('Empty Tank', () => {

        it('Should withdraw chi token balance at contract\'s address', async () => {

            const balBefore = await ShadowGas.tankAmount();

            if (balBefore > 0) await ShadowGas.emptyTank(balBefore);

            const balAfter = await ShadowGas.tankAmount();

            expect(balAfter).to.equal(0.0);

        });
    });

    describe('Refuel', () => {


        it('Should mint 20 chi tokens at contract\'s address', async () => {

            const balBefore = await ShadowGas.tankAmount();

            await ShadowGas.refuel(20).then(tx => {
                console.log(tx);
            });

            const balAfter = await ShadowGas.tankAmount();

            expect(balAfter).to.equal(20);

        });

    });

    describe('Station Balance', () => {

        it('Should retrieve chi token balance at contract\'s address', async () => {

            const balBefore = await ShadowGas.tankAmount();

            if (balBefore > 0) await ShadowGas.emptyTank(balBefore); // withdraw all

            // mint 1
            await ShadowGas.refuel(1).then(tx => {
                console.log(tx);
            });

            const balAfter = await ShadowGas.tankAmount();

            expect(balAfter).to.equal(1);

        });

    });

});