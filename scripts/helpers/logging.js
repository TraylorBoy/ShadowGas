exports.talk = (msg) => {
    console.log('\n==================');
    console.log(`Shadow - ${msg}`);
    console.log('==================\n');
};

exports.txInfo = (gasPrice, gasLimit, waitTime, txCost) => {
    this.talk(`Gas Limit: ${gasLimit}`);
    this.talk(`Gas Price: ${gasPrice} Gwei`);
    this.talk(`Expected Wait Time: < ${waitTime} minutes`);
    this.talk(`Max Cost for Transaction: ${txCost} eth`);
};

exports.purchaseHistory = (price, amount) => {

    this.talk('Purchase History');

    let priceBefore = 0;
    let total = 0;

    for (let i = 0; i < price.length; i++) {
        
        if (price[i] / 1000000000 != priceBefore) this.talk(`Gas Price: ${price[i] / 1000000000}, Amount: ${amount[i]}`);

        priceBefore = price[i] / 1000000000;

    }


};