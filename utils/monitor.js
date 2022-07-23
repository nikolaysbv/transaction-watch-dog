import WebSocket from "ws";

export default (endpoint) => {
  const ws = new WebSocket(endpoint);

  ws.on("close", function close() {
    console.log("close");
    openv = false;
  });

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
    const transactionNumber = JSON.parse(data.toString()).params?.result.number;
    // await Transaction.create({ transactionNumber: transactionNumber });
    console.log(transactionNumber);
  });

  console.log("Monitoring started...");
};
