/**
 * The Data Access Object does all communication with
 * the DB (on API level).
 */

import logger from "../../utils/logger.js";
import { NotFoundError } from "../errors/index.js";

class ConfigurationsDao {
  constructor({ configurations }) {
    this.configurations = configurations;
  }
  async getAllConfigurations() {
    const configurations = await this.configurations.findAll();
    return configurations;
  }

  async getConfiguration(id) {
    const configuration = await this.configurations.findOne({
      where: {
        configurationId: id,
      },
    });

    if (!configuration) {
      throw new NotFoundError(`No configuration with id ${id}`);
    }

    return configuration;
  }

  async createConfiguration(fields) {
    const configuration = await this.configurations.create(fields);

    logger.info(
      `Configuration with id ${configuration.configurationId} created.`
    );

    return configuration;
  }

  async updateConfiguration(id, fields) {
    const configuration = await this.configurations.findOne({
      where: {
        configurationId: id,
      },
    });

    if (!configuration) {
      throw new NotFoundError(`No configuration with id ${id}`);
    }

    configuration.set(fields);

    await configuration.save();

    logger.info(`Configuration with id ${id} updated.`);

    return configuration;
  }

  async deleteConfiguration(id) {
    const configuration = await this.configurations.findOne({
      where: {
        configurationId: id,
      },
    });

    if (!configuration) {
      throw new NotFoundError(`No configuration with id ${id}`);
    }

    await configuration.destroy();

    logger.info(`Configuration with id ${id} deleted.`);
  }
}

export default ConfigurationsDao;
