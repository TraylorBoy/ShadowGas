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