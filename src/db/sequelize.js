/**
 * Here connect to the DB and create two tables -
 * Transactions and Configurations using our
 * model constructor functions.
 */

import "dotenv/config";
import logger from "../utils/logger.js";
import { Sequelize } from "sequelize";
import {
  TransactionModelConstructor,
  ConfigurationModelConstructor,
} from "./models/index.js";

// new DB connection instance
const sequelize = new Sequelize(
  "watchdog",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    pool: { min: 0, max: 10 },
  }
);

const Transactions = TransactionModelConstructor(sequelize, Sequelize);
const Configurations = ConfigurationModelConstructor(sequelize, Sequelize);

// set up one Configuration to many Transactions relationship
Configurations.hasMany(Transactions, {
  foreignKey: "configurationId",
});

// sync with the DB and notify
await sequelize.sync().then(() => {
  logger.info(`Database & tables created...`);
});

export { Transactions, Configurations };
