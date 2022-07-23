import { sequelizeExp } from "../db/connect.js";

const applyRules = async () => {
  const rules = await sequelizeExp.Rules.findAll();

  for (let rule of rules) {
    const ruleDoes = rule.dataValues.ruleDef;
    console.log(ruleDoes);
  }
};

export default applyRules;
