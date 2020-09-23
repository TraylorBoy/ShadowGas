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

// npx buidler refuel --token < Chi/Lgt >
task('refuel', 'Mints amount of gas tokens defined in shadow.config and stores them at contract\'s address')

    .addParam('token', 'Token to mint')

    .setAction(async (taskArgs) => {

        const refuel = async () => {

            try {

                const path = `./scripts/store/refuel${(taskArgs.token).toString()}.js`;

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }

        };

        await refuel();

    });

// npx buidler tank --token < Chi/Lgt >
task('tank', 'Deploys ShadowGas to default network')

    .addParam('token', 'Token to retrieve balance for')

    .setAction(async (taskArgs) => {

        const tank = async () => {

            try {

                const path = `./scripts/store/tank${(taskArgs.token).toString()}.js`;

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }

        };

        await tank();

    });

// npx buidler empty --token < Chi/Lgt >
task('empty', 'Transfers tokens from contract to possessor')

    .addParam('token', 'Token to transfer')

    .setAction(async (taskArgs) => {

        const empty = async () => {

            try {

                const path = `./scripts/transfer/empty${(taskArgs.token).toString()}.js`;

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }

        };

        await empty();

    });

// npx buidler emptyTo --token < Chi/Lgt >
task('emptyTo', 'Transfers tokens from contract to address')

    .addParam('token', 'Token to transfer')

    .setAction(async (taskArgs) => {

        const emptyTo = async () => {

            try {

                const path = `./scripts/transfer/empty${(taskArgs.token).toString()}To.js`;

                await execShPromise(`npx buidler run ${path}`);

            } catch (error) {

                console.error(error.message);

            }

        };

        await emptyTo();

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
        runOnCompile: false
    }
};