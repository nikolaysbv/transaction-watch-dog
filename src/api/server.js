import express from "express";
const app = express();

// modules
import "express-async-errors";

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

// routers
import rulesRouter from "./routes/rulesRouter.js";

app.use(express.json());

app.use("/api/v1/rules", rulesRouter);

// app.get("*", (req, res) => {
//   res.send("Hi!");
// });

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const startHttpServer = () => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...\n`);
  });
};

export default startHttpServer;
