const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/EmployeeController");

router
  .route("/:id")
  .put(employeeController.update)
  .delete(employeeController.remove)
  .get(employeeController.getById);
router.route("/").get(employeeController.getAll).post(employeeController.add);

module.exports = router;
