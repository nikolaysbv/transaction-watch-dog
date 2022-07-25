import { models } from "../../db/sequelize.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const getAllConfigurations = async (req, res) => {
  const configurations = await models.Configurations.findAll();
  res.status(200).json(configurations);
};

const getConfiguration = async (req, res) => {
  const configurationId = req.params.id;
  const configuration = await models.Configurations.findOne({
    where: {
      configurationId: configurationId,
    },
  });

  if (!configuration) {
    throw new NotFoundError(`No configuration with id ${configurationId}`);
  }

  res.status(StatusCodes.OK).json(configuration);
};

const createConfiguration = async (req, res) => {
  const {
    configurationName,
    configurationBlockHash,
    configurationBlockNumber,
    configurationFrom,
    configurationGas,
    configurationGasPrice,
    configurationHash,
    configurationNonce,
    configurationTo,
    configurationTransactionIndex,
    configurationType,
    configurationValue,
  } = req.body;

  if (
    !configurationBlockHash &&
    !configurationFrom &&
    !configurationBlockNumber &&
    !configurationGas &&
    !configurationGasPrice &&
    !configurationHash &&
    !configurationNonce &&
    !configurationTo &&
    !configurationTransactionIndex &&
    !configurationType &&
    !configurationValue
  ) {
    throw new BadRequestError("Please provide configuration propeties!");
  }

  const configuration = await models.Configurations.create({
    configurationName,
    configurationBlockHash,
    configurationBlockNumber,
    configurationFrom,
    configurationGas,
    configurationGasPrice,
    configurationHash,
    configurationNonce,
    configurationTo,
    configurationTransactionIndex,
    configurationType,
    configurationValue,
  });

  res.status(StatusCodes.CREATED).json(configuration);
};

const updateConfiguration = async (req, res) => {
  const configurationId = req.params.id;
  const {
    configurationName,
    configurationBlockHash,
    configurationBlockNumber,
    configurationFrom,
    configurationGas,
    configurationGasPrice,
    configurationHash,
    configurationNonce,
    configurationTo,
    configurationTransactionIndex,
    configurationType,
    configurationValue,
  } = req.body;

  if (
    !configurationName &&
    !configurationBlockHash &&
    !configurationFrom &&
    !configurationBlockNumber &&
    !configurationGas &&
    !configurationGasPrice &&
    !configurationHash &&
    !configurationNonce &&
    !configurationTo &&
    !configurationTransactionIndex &&
    !configurationType &&
    !configurationValue
  ) {
    throw new BadRequestError("Please provide configuration propeties!");
  }

  const configuration = await models.Configurations.findOne({
    where: {
      configurationId: configurationId,
    },
  });

  if (!configuration) {
    throw new NotFoundError(`No configuration with id ${configurationId}`);
  }

  configuration.set({
    configurationName,
    configurationBlockHash,
    configurationBlockNumber,
    configurationFrom,
    configurationGas,
    configurationGasPrice,
    configurationHash,
    configurationNonce,
    configurationTo,
    configurationTransactionIndex,
    configurationType,
    configurationValue,
  });

  await configuration.save();

  res.status(StatusCodes.OK).json(configuration);
};

const deleteConfiguration = async (req, res) => {
  const configurationId = req.params.id;
  const configuration = await models.Configurations.findOne({
    where: {
      configurationId: configurationId,
    },
  });

  if (!configuration) {
    throw new NotFoundError(`No configuration with id ${configurationId}`);
  }

  await configuration.destroy();

  res.status(StatusCodes.OK).send("Configuration deleted!");
};

export {
  getAllConfigurations,
  getConfiguration,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
};
