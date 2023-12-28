const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/VehicleController");

router
  .route("/:id")
  .put(vehicleController.update)
  .delete(vehicleController.remove)
  .get(vehicleController.getById);
router.route("/").get(vehicleController.getAll).post(vehicleController.add);
router.route("/profile/:id").get(vehicleController.getAllByUserId)

module.exports = router;
