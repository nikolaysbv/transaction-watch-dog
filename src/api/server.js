import express from "express";
import "express-async-errors";
import logger from "../utils/logger.js";
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import configurationsRouter from "./routes/configurationsRouter.js";

class Server {
  constructor() {
    this.app = express();
    this.setup();
  }

  setup() {
    this.app.use(express.json());
    this.app.use("/api/v1/configurations", configurationsRouter);
    this.app.use(notFoundMiddleware);
    this.app.use(errorHandlerMiddleware);
  }

  run(port) {
    this.app.listen(port, () => {
      logger.info(`Server is listening on port ${port}...\n`);
    });
  }
}

export default Server;
