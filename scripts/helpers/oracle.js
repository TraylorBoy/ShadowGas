const bre = require('@nomiclabs/buidler');
const {
    ethers
} = require('ethers');
const Sauce = require('./utilitySauce');
const fetch = require('node-fetch');
require('dotenv').config();

exports.ethGasStationPrice = async () => {
    return await Sauce.gasInfo();
};

exports.etherScanPrice = async () => {

}