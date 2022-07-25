import "dotenv/config";
import { Sequelize } from "sequelize";
import {
  TransactionModelConstructor,
  ConfigurationModelConstructor,
} from "./models/index.js";

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

Configurations.hasMany(Transactions, {
  foreignKey: "configurationId",
});

await sequelize.sync().then(() => {
  console.log(`\nDatabase & tables created...`);
});

export { Transactions, Configurations };
