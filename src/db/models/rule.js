export default (sequelize, type) => {
  return sequelize.define("rule", {
    ruleId: {
      type: type.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      initialAutoIncrement: 1,
    },
    ruleName: {
      type: type.STRING,
      defaultValue: "Rule",
    },
    ruleBlockHash: {
      type: type.STRING,
      // defaultValue: null,
    },
    ruleBlockNumber: {
      type: type.STRING,
      validate: {
        is: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
      },
    },
    ruleFrom: {
      type: type.STRING,
    },
    ruleGas: {
      type: type.STRING,
      validate: {
        is: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
      },
    },
    ruleGasPrice: {
      type: type.STRING,
      validate: {
        is: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
      },
    },
    ruleHash: {
      type: type.STRING,
    },
    ruleNonce: {
      type: type.STRING,
      validate: {
        is: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
      },
    },
    ruleTo: {
      type: type.STRING,
    },
    ruleTransactionIndex: {
      type: type.STRING,
      validate: {
        is: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
      },
    },
    ruleType: {
      type: type.STRING,
      isIn: [["legacy", "accessList", "EIP-1559"]],
    },
    ruleValue: {
      type: type.STRING,
      validate: {
        is: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
      },
    },
  });
};
