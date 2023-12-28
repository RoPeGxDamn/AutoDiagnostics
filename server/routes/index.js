const express = require("express");
const router = express.Router()

const users = require('./users')
const vehicles = require('./vehicles')
const employees = require('./employees')
const clients = require('./clients')
const services = require('./services')
const daysSchedule = require('./daysSchedule')
const employeesSchedule = require('./employeesSchedule')
const feedback = require('./feedback')
const requests = require('./requests')  
const requestServices = require('./requestServices')  
const results = require('./results')  
const statistics = require('./statistics')  
const db = require('./db')

router.use('/users', users)
router.use('/vehicles', vehicles)
router.use('/employees', employees)
router.use('/clients', clients)
router.use('/services', services)
router.use('/dayschedule', daysSchedule)
router.use('/employeeschedule', employeesSchedule)
router.use('/feedback', feedback)
router.use('/requests', requests)
router.use('/requestservices', requestServices)
router.use('/results', results)
router.use('/statistics', statistics)
router.use('/db', db)

module.exports = router;