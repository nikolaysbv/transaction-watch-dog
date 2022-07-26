/**
 * The entry file to the application.
 */

import "dotenv/config";
import "./di-setup.js";
import Watcher from "./watcher.js";
import Server from "./api/server.js";

const watcher = new Watcher();
watcher.watch(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_API_KEY}`);

const server = new Server();
server.run(process.env.PORT || 5000);
