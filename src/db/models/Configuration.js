export default (sequelize, type) => {
  return sequelize.define("configuration", {
    configurationId: {
      type: type.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      initialAutoIncrement: 1,
    },
    configurationName: {
      type: type.STRING,
      defaultValue: "configuration",
    },
    configurationBlockHash: {
      type: type.STRING,
      // defaultValue: null,
    },
    configurationBlockNumber: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+\.?\d*$|^(range)\s\d+\.?\d*,{1}\d+\.?\d*$/i,
          msg: "must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number],[number]'",
        },
      },
    },
    configurationFrom: {
      type: type.STRING,
    },
    configurationGas: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+\.?\d*$|^(range)\s\d+\.?\d*,{1}\d+\.?\d*$/i,
          msg: "must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number],[number]'",
        },
      },
    },
    configurationGasPrice: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+\.?\d*$|^(range)\s\d+\.?\d*,{1}\d+\.?\d*$/i,
          msg: "must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number],[number]'",
        },
      },
    },
    configurationHash: {
      type: type.STRING,
    },
    configurationNonce: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+\.?\d*$|^(range)\s\d+\.?\d*,{1}\d+\.?\d*$/i,
          msg: "must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number],[number]'",
        },
      },
    },
    configurationTo: {
      type: type.STRING,
    },
    configurationTransactionIndex: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+\.?\d*$|^(range)\s\d+\.?\d*,{1}\d+\.?\d*$/i,
          msg: "must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number],[number]'",
        },
      },
    },
    configurationType: {
      type: type.STRING,
      validate: {
        isIn: {
          args: [["legacy", "accessList", "EIP-1559"]],
          msg: "must be one of 'legacy', 'accessList' or 'EIP-1559'",
        },
      },
    },
    configurationValue: {
      type: type.STRING,
      validate: {
        is: {
          args: /^(eq|lt|lte|gt|gte)\s\d+\.?\d*$|^(range)\s\d+\.?\d*,{1}\d+\.?\d*$/i,
          msg: "must be in the format '<eq|lt|lte|gt|gte> [number]' or '<range> [number],[number]'",
        },
      },
    },
    configurationDelay: {
      type: type.INTEGER.UNSIGNED,
      defaultValue: 0,
    },
  });
};
