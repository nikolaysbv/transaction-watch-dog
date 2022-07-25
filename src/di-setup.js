/**
 * Here we set up our Dependency Injection Container using awilix.
 */

import awilix from "awilix";
import ConfigurationsController from "./api/controllers/configurationsController.js";
import ConfigurationsDao from "./api/dao/configurationsDao.js";
import { Transactions, Configurations } from "./db/sequelize.js";

const container = awilix.createContainer({
  injectionMode: awilix.InjectionMode.PROXY,
});

container.register({
  configurationsController: awilix.asClass(ConfigurationsController),
  configurationsDao: awilix.asClass(ConfigurationsDao),
  transactions: awilix.asValue(Transactions),
  configurations: awilix.asValue(Configurations),
});

export default container;
