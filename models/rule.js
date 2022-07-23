export default (sequelize, type) => {
  return sequelize.define("rule", {
    ruleId: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      initialAutoIncrement: 1,
    },
    ruleDef: {
      type: type.JSON,
    },
  });
};
