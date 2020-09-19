const Logger = require('./logHelper');
const GasToken = require('./gasToken');
const GasHelper = require('./gasHelper');
const Store = require('./storeHelper');

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
    GasHelper,
    Store,
    Sleep
};