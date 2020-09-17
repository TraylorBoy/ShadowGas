usePlugin('buidler-ethers-v5');
usePlugin('buidler-abi-exporter');
usePlugin('buidler-spdx-license-identifier');
usePlugin('buidler-contract-sizer');
usePlugin('@nomiclabs/buidler-waffle');
usePlugin('@nomiclabs/buidler-web3');
require('dotenv').config();

const execSh = require('exec-sh');
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

task('walletBalance', 'Retrieves the amount of ether at the address inputted')

    .addParam('address', 'The address to retrieve ether balance from')

    .setAction(async (taskArgs, bre) => {


        try {

            const account = web3.utils.toChecksumAddress(taskArgs.address);
            const balance = await web3.eth.getBalance(account);

            console.log(web3.utils.fromWei(balance, "ether"), "ETH");

        } catch (error) {

            console.error(error.message);

        }


    });


// `npx buidler deploy`
task('deploy', 'Deploys ShadowGas to default network')

    .setAction(async () => {

        const deploy = async () => {

            try {

                const path = './scripts/deploy.js';

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }

        };

        await deploy();

    });

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

task('history', 'Retrieves purchase history')

    .setAction(async () => {

        const history = async () => {

            try {

                const path = './scripts/shadow/purchaseHistory.js';

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }

        };

        await history();

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
    abiExporter: {
        path: './abi',
        only: [],
        clear: true
    },
    spdxLicenseIdentifier: {
        overwrite: false,
        runOnCompile: true
    },
    contractSizer: {
        alphaSort: false,
        runOnCompile: true
    }
};