const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/StatisticsController");

router.get('/mvclient', statisticsController.getMVClient)
router.get('/mrvehicle', statisticsController.getMRVehicle)
router.get('/mpservice', statisticsController.getMPService)
router.get('/meorder', statisticsController.getMEOrder)
router.get('/avgservice', statisticsController.getHigherAvgService)
router.get('/servbyspec', statisticsController.getAmountBySpec)

module.exports = router;
