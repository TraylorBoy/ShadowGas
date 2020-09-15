usePlugin('buidler-ethers-v5');
usePlugin('buidler-spdx-license-identifier');
usePlugin('buidler-abi-exporter');
usePlugin('buidler-contract-sizer');
usePlugin('@nomiclabs/buidler-waffle');
require('dotenv').config();

const fs = require('fs');
const execShPromise = require('exec-sh').promise;


// gives bre access to shadowConfig
extendEnvironment(bre => {

    const shadowConfig = fs.readFileSync('./shadow.config.json');

    bre.shadowConfig = JSON.parse(shadowConfig);

});

/*


    Tasks 
    (uses defaultNetwork)


*/

// npx buidler stationBalance
task('stationBalance', 'Retrieves amount of chi tokens at contract\'s address')

    .setAction(async bre => {

        const tankAmount = async () => {

            const path = './scripts/station/stationBalance.js';

            try {

                out = await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }
        };

        await tankAmount();

    });

// npx buidler refuel --amount < RefuelAmount >
// `$ npx buidler refuel --amount 140`
task('refuel', 'Mints chi tokens')
    
    .addParam('amount', 'Amount to mint should be <=140')

    .setAction(async (taskArgs, bre) => {
        
        const refuel = async () => {
            const path = './scripts/station/refuel.js';

            try {

                out = await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }
        };

        await refuel();

    });

module.exports = {
    defaultNetwork: 'kovan',
    networks: {
        buidlerevm: {
        },
        kovan: {
            url: process.env.KOVAN,
            accounts: [`0x${process.env.PRIVATEKEY}`]
        },
        ropsten: {
            url: process.env.ROPSTEN,
            accounts: [`0x${process.env.PRIVATEKEY}`]
        }
    },
    solc: {
        version: '0.7.1',
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
    paths: {
        sources: './contracts/7',
        tests: './test',
        cache: './cache',
        artifacts: './artifacts'
    },
    spdxLicenseIdentifier: {
        overwrite: false,
        runOnCompile: true
    },
    abiExporter: {
        path: './abi',
        only: [],
        clear: true
    },
    contractSizer: {
        alphaSort: false,
        runOnCompile: true // `npm run buidler size-contracts` will output compiled contract sizes manually
    }
};
