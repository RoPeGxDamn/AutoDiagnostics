const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/FeedbackController");

router
  .route("/:id")
  .put(feedbackController.update)
  .delete(feedbackController.remove)
  .get(feedbackController.getById);
router.route("/").get(feedbackController.getAll).post(feedbackController.add);
router.get('/profile/:id', feedbackController.getForProfile)

module.exports = router;
