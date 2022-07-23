import { sequelizeExp } from "../db/connect.js";
import WebSocket from "ws";
import applyRules from "./applyRules.js";

export default (endpoint) => {
  const ws = new WebSocket(endpoint);

  ws.on("open", function open() {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_subscribe",
        params: ["newHeads"],
      })
    );
  });

  ws.on("message", async function message(data) {
    const transactionData = JSON.parse(data.toString());
    console.log(transactionData);
    applyRules();
    if (!transactionData.id) {
      const transactionNumber = transactionData.params?.result.number;
      await sequelizeExp.Transactions.create({
        transactionNumber: transactionNumber,
      });
    }
  });

  ws.on("close", function close() {
    console.log("close");
    openv = false;
  });

  console.log("Monitoring started...");
};
