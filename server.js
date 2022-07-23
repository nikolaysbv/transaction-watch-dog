import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import monitorRouter from "./routes/monitorRouter.js";

app.use("/api/v1/monitor", monitorRouter);

app.get("*", (req, res) => {
  res.send("Hi!");
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    // await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
