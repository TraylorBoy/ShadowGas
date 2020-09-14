usePlugin('buidler-ethers-v5');
usePlugin('@nomiclabs/buidler-waffle');
usePlugin('buidler-spdx-license-identifier');
usePlugin('buidler-abi-exporter');
usePlugin('buidler-contract-sizer');

module.exports = {
    defaultNetwork: 'buidlerevm',
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
        version: '0.6.8',
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
    paths: {
        sources: './contracts',
        tests: './tests',
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
