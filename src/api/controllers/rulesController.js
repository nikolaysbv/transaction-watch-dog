import { models } from "../../db/sequelize.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const getAllRules = async (req, res) => {
  const rules = await models.Rules.findAll();
  res.status(200).json(rules);
};

const getRule = async (req, res) => {
  const ruleId = req.params.id;
  const rule = await models.Rules.findOne({
    where: {
      ruleId: ruleId,
    },
  });

  res.status(StatusCodes.OK).json(rule);
};

const createRule = async (req, res) => {
  const {
    ruleName,
    ruleBlockHash,
    ruleBlockNumber,
    ruleFrom,
    ruleGas,
    ruleGasPrice,
    ruleHash,
    ruleNonce,
    ruleTo,
    ruleTransactionIndex,
    ruleType,
    ruleValue,
  } = req.body;

  if (
    !ruleBlockHash &&
    !ruleFrom &&
    !ruleBlockNumber &&
    !ruleGas &&
    !ruleGasPrice &&
    !ruleHash &&
    !ruleNonce &&
    !ruleTo &&
    !ruleTransactionIndex &&
    !ruleType &&
    !ruleValue
  ) {
    throw new BadRequestError("Please provide rule propeties!");
  }

  const rule = await models.Rules.create({
    ruleName,
    ruleBlockHash,
    ruleBlockNumber,
    ruleFrom,
    ruleGas,
    ruleGasPrice,
    ruleHash,
    ruleNonce,
    ruleTo,
    ruleTransactionIndex,
    ruleType,
    ruleValue,
  });

  res.status(StatusCodes.CREATED).json(rule);
};

const updateRule = async (req, res) => {
  const ruleId = req.params.id;
  const newRuleDef = req.body;

  const rule = await models.Rules.findOne({
    where: {
      ruleId: ruleId,
    },
  });

  rule.ruleDef = newRuleDef;

  await rule.save();

  res.status(StatusCodes.OK).json(rule);
};

const deleteRule = async (req, res) => {
  const ruleId = req.params.id;
  const rule = await models.Rules.findOne({
    where: {
      ruleId: ruleId,
    },
  });

  await rule.destroy();

  res.status(StatusCodes.OK).send("Rule deleted!");
};

export { getAllRules, getRule, createRule, updateRule, deleteRule };
