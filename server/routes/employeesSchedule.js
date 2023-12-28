const express = require("express");
const router = express.Router();
const employeesScheduleController = require("../controllers/EmployeesScheduleController");

router
  .route("/:id")
  .put(employeesScheduleController.update)
  .delete(employeesScheduleController.remove)
  .get(employeesScheduleController.getById);
router.route("/").get(employeesScheduleController.getAll).post(employeesScheduleController.add);

module.exports = router;
