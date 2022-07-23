import express from "express";
const app = express();

import "dotenv/config";

import monitorRouter from "./routes/monitorRouter.js";

app.use("/api/v1/monitor", monitorRouter);

app.get("*", (req, res) => {
  res.send("Hi!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}...\n`);
});
