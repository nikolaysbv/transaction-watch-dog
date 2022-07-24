import "dotenv/config";
import { Sequelize } from "sequelize";
import TransactionModelConstructor from "./models/transaction.js";
import RuleModelConstructor from "./models/rule.js";

let models;

const connect = async (db, name, password) => {
  const sequelize = new Sequelize(db, name, password, {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  });

  const Transactions = TransactionModelConstructor(sequelize, Sequelize);
  const Rules = RuleModelConstructor(sequelize, Sequelize);

  await sequelize.sync().then(() => {
    console.log(`\nDatabase & tables created...`);
  });

  models = { Transactions, Rules };
};

export { connect, models };
