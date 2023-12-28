const express = require("express");
const router = express.Router();
const requestController = require("../controllers/RequestController");
const {authenticateJWT, verifyRole, verifyEmployee} = require('../middlewares')

router
  .route("/:id")
  .put(requestController.update)
  .delete(requestController.remove)
  .get(requestController.getById);
router.route("/").get(authenticateJWT, verifyEmployee, requestController.getAll).post(authenticateJWT, requestController.add);
router.get('/profile/:id', requestController.getForProfile)

module.exports = router;
