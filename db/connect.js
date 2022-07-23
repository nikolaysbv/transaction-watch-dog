import "dotenv/config";
import { Sequelize } from "sequelize";
import TransactionModelConstructor from "../models/transaction.js";
import RuleModelConstructor from "../models/rule.js";

let sequelizeExp;

const connectDB = async (db, name, password) => {
  const sequelize = new Sequelize(db, name, password, {
    host: "localhost",
    dialect: "mysql",
  });

  const Transactions = TransactionModelConstructor(sequelize, Sequelize);
  const Rules = RuleModelConstructor(sequelize, Sequelize);

  await sequelize.sync().then(() => {
    console.log(`\nDatabase & tables created...`);
  });

  sequelizeExp = { Transactions, Rules };
};

export { connectDB, sequelizeExp };
