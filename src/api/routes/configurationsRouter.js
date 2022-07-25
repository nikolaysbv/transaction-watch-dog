import express from "express";
const router = express.Router();

import container from "../../di-setup.js";
const configurationsController = container.resolve("configurationsController");

router
  .route("/")
  .get(configurationsController.getAllConfigurations)
  .post(configurationsController.createConfiguration);

router
  .route("/:id")
  .get(configurationsController.getConfiguration)
  .delete(configurationsController.deleteConfiguration)
  .patch(configurationsController.updateConfiguration);

export default router;
