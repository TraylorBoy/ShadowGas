exports.chi = {
    address: "0x0000000000004946c0e9F43F4Dee607b0eF1fA1c",
    symbol: "CHI",
    name: "Chi Token",
    decimals: 0
};

exports.lgt = {
    address: "0x000000000000C1CB11D5c062901F32D06248CE48",
    symbol: "LGT",
    name: "Liquid Gas Token",
    decimals: 0
};

exports.gst = {
    address: "0x0000000000b3F879cb30FE243b4Dfee438691c04",
    kovanAddress: "0x0000000000170CcC93903185bE5A2094C870Df62",
    symbol: "GST2",
    name: "GasToken2",
    decimals: 2,
    abi: [{
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "from",
            "type": "address"
        }, {
            "name": "value",
            "type": "uint256"
        }],
        "name": "freeFromUpTo",
        "outputs": [{
            "name": "freed",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "spender",
            "type": "address"
        }, {
            "name": "value",
            "type": "uint256"
        }],
        "name": "approve",
        "outputs": [{
            "name": "success",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
            "name": "supply",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "from",
            "type": "address"
        }, {
            "name": "to",
            "type": "address"
        }, {
            "name": "value",
            "type": "uint256"
        }],
        "name": "transferFrom",
        "outputs": [{
            "name": "success",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{
            "name": "",
            "type": "uint8"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "from",
            "type": "address"
        }, {
            "name": "value",
            "type": "uint256"
        }],
        "name": "freeFrom",
        "outputs": [{
            "name": "success",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "value",
            "type": "uint256"
        }],
        "name": "freeUpTo",
        "outputs": [{
            "name": "freed",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{
            "name": "owner",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "name": "balance",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "value",
            "type": "uint256"
        }],
        "name": "mint",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "to",
            "type": "address"
        }, {
            "name": "value",
            "type": "uint256"
        }],
        "name": "transfer",
        "outputs": [{
            "name": "success",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": false,
        "inputs": [{
            "name": "value",
            "type": "uint256"
        }],
        "name": "free",
        "outputs": [{
            "name": "success",
            "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{
            "name": "owner",
            "type": "address"
        }, {
            "name": "spender",
            "type": "address"
        }],
        "name": "allowance",
        "outputs": [{
            "name": "remaining",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "from",
            "type": "address"
        }, {
            "indexed": true,
            "name": "to",
            "type": "address"
        }, {
            "indexed": false,
            "name": "value",
            "type": "uint256"
        }],
        "name": "Transfer",
        "type": "event"
    }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "owner",
            "type": "address"
        }, {
            "indexed": true,
            "name": "spender",
            "type": "address"
        }, {
            "indexed": false,
            "name": "value",
            "type": "uint256"
        }],
        "name": "Approval",
        "type": "event"
    }]
}