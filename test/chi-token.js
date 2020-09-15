const {
    expect
} = require('chai');
const {
    ethers
} = require('ethers');
const bre = require('@nomiclabs/buidler');

// Test on buidlerevm network

describe('Contract Chi Token', () => {

    let ShadowGas;
    let ChiToken;
    let shadowGas;
    let chi;
    let owner;
    let addr1;

    beforeEach(async () => {

        [owner, addr1] = await bre.ethers.getSigners();

        ShadowGas = await bre.ethers.getContractFactory('ShadowGas');
        ChiToken = await bre.ethers.getContractFactory('ChiToken');

        shadowGas = await ShadowGas.deploy();
        await shadowGas.deployed();

        chi = await ChiToken.deploy();
        await chi.deployed();


    });

    describe('Balance', () => {

        it('Should retrieve balance of chi tokens from Shadow', async () => {

            expect(ethers.utils.formatEther(await chi.balanceOf(shadowGas.address))).to.equal('0.0');

        });

    });

    // Will always fail if defaultNetwork is not buidlerevm
    describe('Mint', () => {

        it('Should mint 20 Chi Tokens and send them to Shadow', async () => {

            await chi.connect(addr1).mint(20);

            expect(await chi.balanceOf(await addr1.getAddress())).to.equal(20);

            await chi.connect(addr1).approve(shadowGas.address, 20);

            await chi.connect(addr1).transfer(shadowGas.address, 20);

            expect(await chi.balanceOf(shadowGas.address)).to.equal(20);

        });

    });

});