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
  }
}

export default ConfigurationsDao;
