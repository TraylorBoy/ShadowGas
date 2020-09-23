const Logger = require('./logHelper');
const GasToken = require('./gasToken');
const Gas = require('./gasHelper');
const Store = require('./storeHelper');
const Transfer = require('./transferHelper');
const Trade = require('./tradeHelper');
const Oracle = require('./oracleHelper');

const Sleep = async (len) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, len);
    });
};

module.exports = {
    Logger,
    GasToken,
    Gas,
    Store,
    Transfer,
    Trade,
    Oracle,
    Sleep
};