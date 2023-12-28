const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router
  .route("/:id")
  .put(userController.update)
  .delete(userController.remove)
  .get(userController.getById);
router.route("/").get(userController.getAll).post(userController.add);
router.post("/login", userController.login);
router.post("/register", userController.register);

module.exports = router;
