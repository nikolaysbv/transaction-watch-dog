export default (models, ws, web3) => {
  let id = 2;

  return async (data) => {
    const message = JSON.parse(data.toString());

    if (message.id === 1) return;

    if (!message.id) {
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: id++,
          method: "eth_getBlockByNumber",
          params: [message.params.result.number, true],
        })
      );
      return;
    }

    const transactions = message.result.transactions;

    let transactionsAdded = 0;
    for (let transaction of transactions) {
      const newTransaction = {};
      for (let [key, value] of Object.entries(transaction)) {
        if (
          [
            "accessList",
            "input",
            "chainId",
            "maxPriorityFeePerGas",
            "maxFeePerGas",
            "r",
            "s",
            "v",
          ].includes(key)
        )
          continue;
        newTransaction[key] = value;
      }

      if (newTransaction.blockNumber) {
        newTransaction.blockNumber = web3.utils.hexToNumber(
          newTransaction.blockNumber
        );
      }

      if (newTransaction.gas) {
        newTransaction.gas = web3.utils.fromWei(
          web3.utils.hexToNumberString(newTransaction.gas),
          "ether"
        );
      }

      if (newTransaction.gasPrice) {
        newTransaction.gasPrice = web3.utils.fromWei(
          web3.utils.hexToNumberString(newTransaction.gasPrice),
          "ether"
        );
      }

      if (newTransaction.nonce) {
        newTransaction.nonce = web3.utils.hexToNumber(newTransaction.nonce);
      }

      if (newTransaction.transactionIndex) {
        newTransaction.transactionIndex = web3.utils.hexToNumber(
          newTransaction.transactionIndex
        );
      }

      if (newTransaction.value) {
        newTransaction.value = web3.utils.fromWei(
          web3.utils.hexToNumberString(newTransaction.value),
          "ether"
        );
      }

      if (newTransaction.type) {
        newTransaction.type = ["legacy", "accessList", "EIP-1559"].at(
          web3.utils.hexToNumber(newTransaction.type)
        );
      }
      try {
        await models.Transactions.create(newTransaction);
        transactionsAdded++;
      } catch (error) {
        console.log(error);
      }
    }

    console.log(
      `Transactions table updated with ${transactionsAdded} transactions from block number ${web3.utils.hexToNumberString(
        message.result.number
      )}.`
    );
  };
};
