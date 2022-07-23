import express from "express";
const app = express();

import "dotenv/config";

import { connectDB } from "./db/connect.js";
import monitor from "./utils/monitor.js";

import rulesRouter from "./routes/rulesRouter.js";

app.use(express.json());

app.use("/api/v1/rules", rulesRouter);

app.get("*", (req, res) => {
  res.send("Hi!");
});

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  await connectDB("watchdog", process.env.DB_USER, process.env.DB_PASSWORD);
  monitor(process.env.INFURA_ENDPOINT);
  console.log(`Server is listening on port ${port}...\n`);
});
