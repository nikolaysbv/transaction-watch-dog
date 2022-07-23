import WebSocket from "ws";
let ws;
let openv = false;

const monitor = async (req, res) => {
  if (openv) {
    ws.close();
    res.send("monitoring stopped");
    return;
  }

  ws = new WebSocket(process.env.INFURA_ENDPOINT);

  ws.on("close", function close() {
    console.log("close");
    openv = false;
  });

  ws.on("open", function open() {
    openv = true;
    console.log("open");
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_subscribe",
        params: ["newHeads"],
      })
    );
  });

  ws.on("message", function message(data) {
    console.log(JSON.parse(data.toString()).params?.result.number);
  });

  res.send("monitoring started");
};

export default monitor;
