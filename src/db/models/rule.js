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
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
          msg: "Must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number], [number]'",
        },
      },
    },
    ruleFrom: {
      type: type.STRING,
    },
    ruleGas: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
          msg: "Must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number], [number]'",
        },
      },
    },
    ruleGasPrice: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
          msg: "Must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number], [number]'",
        },
      },
    },
    ruleHash: {
      type: type.STRING,
    },
    ruleNonce: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
          msg: "Must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number], [number]'",
        },
      },
    },
    ruleTo: {
      type: type.STRING,
    },
    ruleTransactionIndex: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
          msg: "Must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number], [number]'",
        },
      },
    },
    ruleType: {
      type: type.STRING,
      validate: {
        isIn: {
          args: [["legacy", "accessList", "EIP-1559"]],
          msg: "Must be one of 'legacy', 'accessList' or 'EIP-1559'",
        },
      },
    },
    ruleValue: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+,?\d*|^(range)\s\d+,?\d*,{1}\s\d+,?\d*/i,
          msg: "Must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number], [number]'",
        },
      },
    },
  });
};
