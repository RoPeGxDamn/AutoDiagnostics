const express = require("express");
const router = express.Router();
const dbController = require("../controllers/DbController");

router.post('/query', dbController.makeSqlQuery)
router.get('/report/:id', dbController.makeOrderReport)

module.exports = router;
