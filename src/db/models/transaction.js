export default (sequelize, type) => {
  return sequelize.define("transaction", {
    blockHash: {
      type: type.STRING,
      allowNull: false,
    },
    blockNumber: {
      type: type.BIGINT,
      allowNull: false,
    },
    from: {
      type: type.STRING,
      allowNull: false,
    },
    gas: {
      type: type.STRING,
      defaultValue: 0,
    },
    gasPrice: {
      type: type.STRING,
      defaultValue: 0,
    },
    hash: {
      type: type.STRING,
      primaryKey: true,
      unique: true,
    },
    nonce: {
      type: type.BIGINT,
    },
    to: {
      type: type.STRING,
    },
    transactionIndex: {
      type: type.INTEGER,
    },
    type: {
      type: type.ENUM("legacy", "accessList", "EIP-1559"),
    },
    value: {
      type: type.STRING,
      defaultValue: 0,
    },
    ruleId: {
      type: type.INTEGER,
    },
  });
};
