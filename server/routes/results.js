const express = require("express");
const router = express.Router();
const resultController = require("../controllers/ResultController");

router
  .route("/:id")
  .put(resultController.update)
  .delete(resultController.remove)
  .get(resultController.getById);
router.route("/").get(resultController.getAll).post(resultController.add);
router.get('/feedback/:id', resultController.getForFeedback)

module.exports = router;
