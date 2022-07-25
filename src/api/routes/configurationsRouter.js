import express from "express";
const router = express.Router();

import {
  getAllConfigurations,
  getConfiguration,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
} from "../controllers/configurationsController.js";

router.route("/").get(getAllConfigurations).post(createConfiguration);
router
  .route("/:id")
  .get(getConfiguration)
  .delete(deleteConfiguration)
  .patch(updateConfiguration);

export default router;
