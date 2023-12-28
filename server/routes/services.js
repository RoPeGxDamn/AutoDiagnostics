const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/ServiceController");

router
  .route("/:id")
  .put(serviceController.update)
  .delete(serviceController.remove)
  .get(serviceController.getById);
router.route("/").get(serviceController.getAll).post(serviceController.add);

module.exports = router;
