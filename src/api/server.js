import express from "express";
const app = express();

import rulesRouter from "./routes/rulesRouter.js";

app.use(express.json());

app.use("/api/v1/rules", rulesRouter);

app.get("*", (req, res) => {
  res.send("Hi!");
});

const port = process.env.PORT || 5000;

const startHttpServer = () => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...\n`);
  });
};

export default startHttpServer;
