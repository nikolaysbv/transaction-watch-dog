export default (sequelize, type) => {
  return sequelize.define("rule", {
    ruleName: {
      type: type.STRING,
    },
    ruleDoes: {
      type: type.JSON,
    },
  });
};
