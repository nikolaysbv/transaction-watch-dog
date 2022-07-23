import { sequelizeExp } from "../db/connect.js";

const getAllRules = async (req, res) => {
  const rules = await sequelizeExp.Rules.findAll();
  res.status(200).json(rules);
};

const getRule = async (req, res) => {
  const ruleId = req.params.id;
  const rule = await sequelizeExp.Rules.findOne({
    where: {
      ruleId: ruleId,
    },
  });

  res.status(200).json(rule);
};

const createRule = async (req, res) => {
  const ruleDef = req.body;

  await sequelizeExp.Rules.create({ ruleDef: ruleDef });

  res.status(200).send("Rule created!");
};

const updateRule = async (req, res) => {
  const ruleId = req.params.id;
  const newRuleDef = req.body;

  const rule = await sequelizeExp.Rules.findOne({
    where: {
      ruleId: ruleId,
    },
  });

  rule.ruleDef = newRuleDef;

  await rule.save();

  res.status(200).json(rule);
};

const deleteRule = async (req, res) => {
  const ruleId = req.params.id;
  const rule = await sequelizeExp.Rules.findOne({
    where: {
      ruleId: ruleId,
    },
  });

  await rule.destroy();

  res.status(200).send("Rule deleted!");
};

export { getAllRules, getRule, createRule, updateRule, deleteRule };
