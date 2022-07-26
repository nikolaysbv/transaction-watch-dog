/**
 * Here we determine the outcome of HTTP requests.
 */

import { BadRequestError } from "../errors/index.js";

class ConfigurationsController {
  constructor({ configurationsDao }) {
    // inject the data access object
    this.configurationsDao = configurationsDao;

    // 'this' bindings necessary for functions
    this.getAllConfigurations = this.getAllConfigurations.bind(this);
    this.getConfiguration = this.getConfiguration.bind(this);
    this.createConfiguration = this.createConfiguration.bind(this);
    this.updateConfiguration = this.updateConfiguration.bind(this);
    this.deleteConfiguration = this.deleteConfiguration.bind(this);
  }

  async getAllConfigurations(req, res) {
    const configurations = await this.configurationsDao.getAllConfigurations();
    res.status(200).json(configurations);
  }

  async getConfiguration(req, res) {
    const configurationId = req.params.id;
    const configuration = await this.configurationsDao.getConfiguration(
      configurationId
    );

    res.status(200).json(configuration);
  }

  async createConfiguration(req, res) {
    const {
      configurationName,
      configurationBlockHash,
      configurationBlockNumber,
      configurationFrom,
      configurationGas,
      configurationGasPrice,
      configurationTransactionFee,
      configurationHash,
      configurationNonce,
      configurationTo,
      configurationTransactionIndex,
      configurationType,
      configurationValue,
      configurationDelay,
    } = req.body;

    if (
      !configurationBlockHash &&
      !configurationFrom &&
      !configurationBlockNumber &&
      !configurationGas &&
      !configurationGasPrice &&
      !configurationTransactionFee &&
      !configurationHash &&
      !configurationNonce &&
      !configurationTo &&
      !configurationTransactionIndex &&
      !configurationType &&
      !configurationValue
    ) {
      throw new BadRequestError("Please provide configuration propeties!");
    }

    const configuration = await this.configurationsDao.createConfiguration({
      configurationName,
      configurationBlockHash,
      configurationBlockNumber,
      configurationFrom,
      configurationGas,
      configurationGasPrice,
      configurationTransactionFee,
      configurationHash,
      configurationNonce,
      configurationTo,
      configurationTransactionIndex,
      configurationType,
      configurationValue,
      configurationDelay,
    });

    res.status(201).json(configuration);
  }

  async updateConfiguration(req, res) {
    const configurationId = req.params.id;
    const {
      configurationName,
      configurationBlockHash,
      configurationBlockNumber,
      configurationFrom,
      configurationGas,
      configurationGasPrice,
      configurationTransactionFee,
      configurationHash,
      configurationNonce,
      configurationTo,
      configurationTransactionIndex,
      configurationType,
      configurationValue,
      configurationDelay,
    } = req.body;

    if (
      !configurationName &&
      !configurationBlockHash &&
      !configurationFrom &&
      !configurationBlockNumber &&
      !configurationGas &&
      !configurationGasPrice &&
      !configurationTransactionFee &&
      !configurationHash &&
      !configurationNonce &&
      !configurationTo &&
      !configurationTransactionIndex &&
      !configurationType &&
      !configurationValue &&
      !configurationDelay
    ) {
      throw new BadRequestError("Please provide configuration propeties!");
    }

    const configuration = await this.configurationsDao.updateConfiguration(
      configurationId,
      {
        configurationName,
        configurationBlockHash,
        configurationBlockNumber,
        configurationFrom,
        configurationGas,
        configurationGasPrice,
        configurationTransactionFee,
        configurationHash,
        configurationNonce,
        configurationTo,
        configurationTransactionIndex,
        configurationType,
        configurationValue,
        configurationDelay,
      }
    );

    res.status(200).json(configuration);
  }

  async deleteConfiguration(req, res) {
    const configurationId = req.params.id;
    await this.configurationsDao.deleteConfiguration(configurationId);

    res.status(200).send("Configuration deleted!");
  }
}

export default ConfigurationsController;
