export default (models, ws, web3) => {
  let id = 2;

  return async (data) => {
    const message = JSON.parse(data.toString());

    if (message.id === 1) {
      // returns the subscription successful message
      return;
    }

    if (!message.id) {
      // messages about new header enter here
      // sending a message with the block number to get all transactions in block
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

    // if a message gets to this point, it is a message with properties of the new block
    // get all transactions of new block
    const transactions = message.result.transactions;

    // get all available configurations at time of message received
    const configurations = await models.Configurations.findAll();
    // if no configurations are available, skip block
    if (!configurations.length) {
      console.log(
        `No configurations set. Block number ${web3.utils.hexToNumberString(
          message.result.number
        )} skipped.`
      );
      return;
    }

    // transactions added to db counter
    let transactionsAdded = 0;
    // start looping through transactions in block
    for (let transaction of transactions) {
      const newTransaction = {};
      // get only necessary props of transaction and add them to new object newTransaction
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

      /**
       * Reformatting fields which we need in non-hex format.
       */

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

      const comparisonMap = new Map([
        ["eq", "==="],
        ["lt", "<"],
        ["lte", "<="],
        ["gt", ">"],
        ["gte", ">="],
        // ["range", ""],
      ]);

      /**
       * We have the completed transaction object, now go through all configurations
       * and check if it passes any
       */

      for (let configuration of configurations) {
        /**
         * Only get non-null and non-system field from configuration
         */
        const applicableRules = Object.entries(configuration.dataValues).filter(
          (rule) => {
            const [key, value] = rule;
            return (
              value &&
              ![
                "configurationId",
                "configurationName",
                "createdAt",
                "updatedAt",
              ].includes(key)
            );
          }
        );

        let configurationPassed = true;

        /**
         * Apply each of the applicable rules from configuration;
         * if any rule is not passed, go to next configuration
         */

        for (let rule of applicableRules) {
          const [key, value] = rule;
          const transactionSubsequentKey =
            key.slice(13, 14).toLowerCase() + key.slice(14);
          const transactionSubsequentValue =
            newTransaction[transactionSubsequentKey];

          if (
            [
              "blockNumber",
              "gas",
              "gasPrice",
              "nonce",
              "transactionIndex",
              "value",
            ].includes(transactionSubsequentKey)
          ) {
            const [comparisonOperator, comparisonNumber] = value.split(" ", 2);
            const rulePassed =
              comparisonOperator !== "range"
                ? Function(
                    `return ${parseFloat(
                      transactionSubsequentValue
                    )} ${comparisonMap.get(comparisonOperator)} ${parseFloat(
                      comparisonNumber
                    )}`
                  )()
                : Function(
                    `return ${parseFloat(
                      transactionSubsequentValue
                    )} >= ${parseFloat(
                      comparisonNumber.split(",")[0]
                    )} && ${parseFloat(
                      transactionSubsequentValue
                    )} <= ${parseFloat(comparisonNumber.split(",")[1])}`
                  )();

            if (!rulePassed) {
              configurationPassed = false;
              break;
            }

            continue;
          }

          if (transactionSubsequentValue !== value) {
            configurationPassed = false;
            break;
          }
        }

        /**
         * If all rules of a configuration are passed,
         * write transaction to db
         */

        if (configurationPassed) {
          try {
            newTransaction.configurationId =
              configuration.dataValues.configurationId;
            await models.Transactions.create(newTransaction);
            transactionsAdded++;
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    console.log(
      `Transactions table updated with ${transactionsAdded} transactions from block number ${web3.utils.hexToNumberString(
        message.result.number
      )}.`
    );
  };
};
