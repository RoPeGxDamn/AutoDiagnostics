const express = require("express");
const router = express.Router();
const requestServiceController = require("../controllers/RequestServiceController");

router
  .route("/:id")
  .put(requestServiceController.update)
  .delete(requestServiceController.remove)
  .get(requestServiceController.getById);
router.route("/").get(requestServiceController.getAll).post(requestServiceController.add);

module.exports = router;
