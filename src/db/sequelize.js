import "dotenv/config";
import { Sequelize } from "sequelize";
import {
  TransactionModelConstructor,
  ConfigurationModelConstructor,
} from "./models/index.js";

let models;

const connect = async (db, name, password) => {
  const sequelize = new Sequelize(db, name, password, {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  });

  const Transactions = TransactionModelConstructor(sequelize, Sequelize);
  const Configurations = ConfigurationModelConstructor(sequelize, Sequelize);

  Configurations.hasMany(Transactions, {
    foreignKey: "configurationId",
  });

  await sequelize.sync().then(() => {
    console.log(`\nDatabase & tables created...`);
  });

  models = { Transactions, Configurations };
};

export { connect, models };
