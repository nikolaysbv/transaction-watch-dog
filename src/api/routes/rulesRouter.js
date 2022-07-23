import express from "express";
const router = express.Router();

import {
  getAllRules,
  getRule,
  createRule,
  updateRule,
  deleteRule,
} from "../controllers/rulesController.js";

router.route("/").get(getAllRules).post(createRule);
router.route("/:id").get(getRule).delete(deleteRule).patch(updateRule);

export default router;
