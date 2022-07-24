import WebSocket from "ws";
import web3 from "web3";
import { openHandler, closeHandler, messageHandler } from "./handlers/index.js";
import { models } from "../db/sequelize.js";

export default async (endpoint) => {
  const ws = new WebSocket(endpoint);

  ws.on("open", openHandler(ws));

  ws.on("message", messageHandler(models, ws, web3));

  ws.on("close", closeHandler());

  console.log("Monitoring started...");
};
