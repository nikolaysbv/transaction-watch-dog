import "dotenv/config";
import { connect as connectToDatabase } from "./db/sequelize.js";
import openWebSocket from "./watcher/socket.js";
import startHttpServer from "./api/server.js";

(async () => {
  try {
    await connectToDatabase(
      "watchdog",
      process.env.DB_USER,
      process.env.DB_PASSWORD
    );
    openWebSocket(process.env.INFURA_ENDPOINT);
    startHttpServer();
  } catch (error) {
    console.log(error);
  }
})();
