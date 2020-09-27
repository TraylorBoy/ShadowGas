const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const {
    expect
} = require('chai');
const {
    Gas,
    GasToken
} = require('../scripts/helpers/helper');
require('dotenv').config();

const BigNumber = require('bignumber.js');

describe('Gst', () => {

    let ShadowGas;
    let gstToken;
    let gasLimit;
    let gasPrice;

    beforeEach(async () => {

        ShadowGas = await bre.ethers.getContractAt('ShadowGas', process.env.SHADOWGAS);

        // MAINNET: 0x0000000000b3F879cb30FE243b4Dfee438691c04
        // KOVAN: 0x0000000000170CcC93903185bE5A2094C870Df62
        gstToken = await bre.ethers.getContractAt(GasToken.gst.abi, '0x0000000000170CcC93903185bE5A2094C870Df62');

        let gasInfo = await Gas.etherScanTransaction();

        gasLimit = gasInfo.gasLimit;
        gasPrice = gasInfo.gasPrice;

    });

    describe('tankGst', () => {

        it('Should return the contract\'s Gst Balance', async () => {

            const bal = parseFloat(ethers.utils.formatUnits(await ShadowGas.tankGst(), 2));

            const balChecker = parseFloat(ethers.utils.formatUnits(await gstToken.balanceOf(process.env.SHADOWGAS), 2));

            expect(bal).to.equal(balChecker);

        });

    });

    describe('refuelGst', () => {

        it('Should mint 0.01 gst token and store it at contract\'s address', async () => {

            const balStart = (ethers.utils.formatUnits(await ShadowGas.tankGst(), 2)).toString();

            await ShadowGas.refuelGst(ethers.utils.parseUnits("0.01", 2), {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            const balEnd = (ethers.utils.formatUnits(await ShadowGas.tankGst(), 2)).toString();

            expect(parseFloat(balEnd)).to.be.greaterThan(parseFloat(balStart));

        });

    });

    describe('emptyGstTank', () => {

        it('Should mint and transfer 0.01 Gst from contract\'s Gst Balance to possessor', async () => {

            const balStart = ethers.utils.formatUnits(await ShadowGas.tankGst(), 2);

            await ShadowGas.refuelGst(ethers.utils.parseUnits("0.01", 2), {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            await ShadowGas.emptyGstTank(ethers.utils.parseUnits("0.01", 2), {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            }).catch((err) => {

                console.error(err.message);

            });

            const balEnd = ethers.utils.formatUnits(await ShadowGas.tankGst(), 2);

            expect(balEnd.toString()).to.equal(balStart.toString());

        });

    });

    describe('emptyGstTankTo', () => {

        it('Should mint and transfer 0.01 Gst from contract\'s Gst Balance to address', async () => {

            const balStart = ethers.utils.formatUnits(await ShadowGas.tankGst(), 2);

            await ShadowGas.refuelGst(ethers.utils.parseUnits("0.01", 2), {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            });

            await ShadowGas.emptyGstTankTo(ethers.utils.parseUnits("0.01", 2), bre.shadowConfig.EmptyGstTo, {

                gasLimit,
                gasPrice

            }).then(async (tx) => {

                await tx.wait();

            }).catch((err) => {

                console.error(err.message);

            });

            const balEnd = ethers.utils.formatUnits(await ShadowGas.tankGst(), 2);

            expect(balEnd.toString()).to.equal(balStart.toString());

        });

    });


});