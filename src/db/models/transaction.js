export default (sequelize, type) => {
  return sequelize.define("transaction", {
    transactionNumber: {
      type: type.STRING,
    },
  });
};
