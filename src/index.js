import "dotenv/config";
import "./di-setup.js";
import Watcher from "./watcher.js";
import Server from "./api/server.js";

const watcher = new Watcher();
watcher.watch(process.env.INFURA_ENDPOINT);

const server = new Server();
server.run(process.env.PORT || 5000);
