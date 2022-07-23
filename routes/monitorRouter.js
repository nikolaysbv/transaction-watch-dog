import express from "express";
const router = express.Router();

import monitor from "../controllers/monitorController.js";

router.route("/").get(monitor);

export default router;
