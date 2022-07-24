export default (sequelize, type) => {
  return sequelize.define("rule", {
    ruleId: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      initialAutoIncrement: 1,
    },
    ruleFrom: {
      type: type.STRING,
    },
    ruleTo: {
      type: type.STRING,
    },
    ruleValue: {
      type: type.FLOAT,
    },
  });
};
