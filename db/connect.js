import "dotenv/config";
import { Sequelize } from "sequelize";
import TransactionModelConstructor from "../models/transaction.js";

const connectDB = async (db, name, password) => {
  const sequelize = new Sequelize(db, name, password, {
    host: "localhost",
    dialect: "mysql",
  });

  const Transaction = TransactionModelConstructor(sequelize, Sequelize);

  await sequelize.sync({ force: true }).then(() => {
    console.log(`\nDatabase & tables created...`);
  });
};

export default connectDB;
