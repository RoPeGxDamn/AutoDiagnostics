const express = require("express");
const router = express.Router();
const clientController = require("../controllers/ClientController");

router
  .route("/:id")
  .put(clientController.update)
  .delete(clientController.remove)
  .get(clientController.getById);
router.route("/").get(clientController.getAll).post(clientController.add);

module.exports = router;
