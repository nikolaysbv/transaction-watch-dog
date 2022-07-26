/**
 * The Watcher opens a connection to the Ethereum blockchain
 * and watches for transactions, to which we can apply
 * the rules from our DB.
 */

import WebSocket from "ws";
import web3 from "web3";
import { Transactions, Configurations } from "./db/sequelize.js";
import { Op, literal } from "sequelize";
import comparisonMap from "./utils/comparisonMap.js";
import logger from "./utils/logger.js";

class Watcher {
  constructor() {
    // 'this' bindings necessary for handle functions to work
    this.handleOpen = this.handleOpen.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  // open websocket and listen for events from blockchain
  watch(endpoint) {
    this.ws = new WebSocket(endpoint);

    this.ws.on("open", this.handleOpen);
    this.ws.on("message", this.handleMessage);
    this.ws.on("close", this.handleClose);

    logger.info("Monitoring started...");
  }

  handleOpen() {
    this.ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_subscribe",
        params: ["newHeads"],
      })
    );
  }

  // handle all incoming messages from websocket here
  async handleMessage(data) {
    const message = JSON.parse(data.toString());

    /**
     * Return on message with subscription info.
     */

    if (message.id === 1) {
      return;
    }

    /**
     * On message about a new header, another request to
     * the websocket, asking for more info about the block.
     */

    if (!message.id) {
      this.ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "eth_getBlockByNumber",
          params: [message.params.result.number, true],
        })
      );
      return;
    }

    /**
     * If a message gets to this point, it is a message with properties
     * of the new block, so we get all transactions of new block.
     */

    const transactions = message.result.transactions;

    /**
     * Get all available configurations at time of message received,
     * and if no configurations are available, skip block.
     */

    const configurations = await Configurations.findAll({
      where: {
        configurationDelay: 0,
      },
    });
    if (!configurations.length) {
      logger.info(
        `No configurations set. Block number ${web3.utils.hexToNumberString(
          message.result.number
        )} skipped.`
      );
      return;
    }

    // decrement by one delay of configurations with delay
    await this.decrementDelayInConfigurations();

    // transactions added to the database
    let transactionsAdded = 0;

    /**
     * Start looping through transactions in block.
     */

    for (let transaction of transactions) {
      const newTransaction = {};

      /**
       * Get only the necessary props of transaction and add
       * them to new object newTransaction.
       */

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

      /**
       * We have the completed transaction object, now go through all configurations
       * and check if it passes any.
       */

      for (let configuration of configurations) {
        /**
         * Only get non-null and non-system field from configuration.
         */

        const applicableRules = Object.entries(configuration.dataValues).filter(
          (rule) => {
            const [key, value] = rule;
            return (
              value &&
              ![
                "configurationId",
                "configurationName",
                "configurationDelay",
                "createdAt",
                "updatedAt",
              ].includes(key)
            );
          }
        );

        let configurationPassed = true;

        /**
         * Apply each of the applicable rules from configuration;
         * if any rule is not passed, go to next configuration.
         */

        for (let rule of applicableRules) {
          const [key, value] = rule;
          const transactionSubsequentKey =
            key.slice(13, 14).toLowerCase() + key.slice(14);
          const transactionSubsequentValue =
            newTransaction[transactionSubsequentKey];

          /**
           * If rule is numeric, compare it using the comparison
           * map, if string, directly compare values.
           */

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
            const rulePassed = this.isRulePassed(
              transactionSubsequentValue,
              comparisonOperator,
              comparisonNumber
            );

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
         * write transaction to db and skip checking
         * next configurations for this transaction.
         */

        if (configurationPassed) {
          try {
            newTransaction.configurationId =
              configuration.dataValues.configurationId;
            await Transactions.create(newTransaction);
            transactionsAdded++;
            break;
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    logger.info(
      `Transactions table updated with ${transactionsAdded} transactions from block number ${web3.utils.hexToNumberString(
        message.result.number
      )}.`
    );
  }

  handleClose() {
    logger.info("Websocket closed.");
  }

  isRulePassed(value, operator, compareValue) {
    return operator !== "range"
      ? Function(
          `return ${parseFloat(value)} ${comparisonMap.get(
            operator
          )} ${parseFloat(compareValue)}`
        )()
      : Function(
          `return ${parseFloat(value)} >= ${parseFloat(
            compareValue.split(",")[0]
          )} && ${parseFloat(value)} <= ${parseFloat(
            compareValue.split(",")[1]
          )}`
        )();
  }

  async decrementDelayInConfigurations() {
    /**
     * Find all configurations which have delay
     * and decrement that delay by one (function is
     * called on each new block).
     */

    await Configurations.update(
      { configurationDelay: literal("configurationDelay - 1") },
      {
        where: {
          configurationDelay: {
            [Op.ne]: 0,
          },
        },
      }
    );
  }
}

export default Watcher;
