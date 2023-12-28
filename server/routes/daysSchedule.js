const express = require("express");
const router = express.Router();
const daysScheduleController = require("../controllers/DaysScheduleController");

router
  .route("/:id")
  .put(daysScheduleController.update)
  .delete(daysScheduleController.remove)
  .get(daysScheduleController.getById);
router.route("/").get(daysScheduleController.getAll).post(daysScheduleController.add);

module.exports = router;
