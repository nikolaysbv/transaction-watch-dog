import "dotenv/config";
import { Sequelize } from "sequelize";
import TransactionModelConstructor from "../models/transaction.js";

const sequelize = new Sequelize(
  "watchdog",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

const Transaction = TransactionModelConstructor(sequelize, Sequelize);

sequelize.sync({ force: true }).then(() => {
  console.log(`\nDatabase & tables created!`);
});

export { Transaction };
