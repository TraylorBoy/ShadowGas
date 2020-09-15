usePlugin('buidler-ethers-v5');
usePlugin('buidler-spdx-license-identifier');
usePlugin('buidler-abi-exporter');
usePlugin('buidler-contract-sizer');
usePlugin('@nomiclabs/buidler-waffle');
require('dotenv').config();

const fs = require('fs');
const execShPromise = require('exec-sh').promise;
const shadowConfig = fs.readFileSync('./shadow.config.json');
/* -------------------------------------------------------------------------- */

// gives bre access to shadowConfig
extendEnvironment(bre => {

    bre.shadowConfig = JSON.parse(shadowConfig);

});

/* -------------------------------------------------------------------------- */

/*


    Tasks 
    (uses defaultNetwork)


*/


// `npx buidler stationBalance`
task('stationBalance', 'Retrieves amount of chi tokens at contract\'s address')

    .setAction(async () => {

        const tankAmount = async () => {

            try {

                const path = './scripts/station/stationBalance.js';

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }
        };

        await tankAmount();

    });

// `$ npx buidler refuel`
// set RefuelAmount in shadow.config
task('refuel', 'Mints chi tokens')

    .setAction(async (taskArgs, bre) => {

        const refuel = async () => {

            try {
                const path = './scripts/station/refuel.js';

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }
        };

        await refuel();

    });


// `npx buidler emptyTank`
// set withdraw amount in shadow.config
task('emptyTank', 'Withdraws chi tokens from contract')

    .setAction(async (taskArgs) => {

        const emptyTank = async () => {

            try {

                const path = './scripts/station/emptyTank.js';

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }

        };

        await emptyTank();


    });


module.exports = {
    defaultNetwork: 'kovan',
    networks: {
        buidlerevm: {},
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