import "dotenv/config";
import { Sequelize } from "sequelize";
import {
  TransactionModelConstructor,
  RuleModelConstructor,
} from "./models/index.js";

let models;

const connect = async (db, name, password) => {
  const sequelize = new Sequelize(db, name, password, {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  });

  const Transactions = TransactionModelConstructor(sequelize, Sequelize);
  const Rules = RuleModelConstructor(sequelize, Sequelize);

  Rules.hasMany(Transactions, {
    foreignKey: "ruleId",
  });

  await sequelize.sync().then(() => {
    console.log(`\nDatabase & tables created...`);
  });

  models = { Transactions, Rules };
};

export { connect, models };
