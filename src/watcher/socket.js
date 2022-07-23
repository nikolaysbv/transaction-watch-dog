import WebSocket from "ws";
import { openHandler, closeHandler, messageHandler } from "./handlers/index.js";
import { models } from "../db/sequelize.js";

export default (endpoint) => {
  const ws = new WebSocket(endpoint);

  ws.on("open", openHandler(ws));

  ws.on("message", messageHandler(models));

  ws.on("close", closeHandler());

  console.log("Monitoring started...");
};
