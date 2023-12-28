const pool = require("../db");

class StatisticsController {
  // most valuable client
  async getMVClient(req, res, next) {
    const query = `SELECT users.surname, users.name, SUM(services.cost) FROM request_services
                    INNER JOIN requests on request_services.request_id = requests.id
                    INNER JOIN services on request_services.service_id = services.id
                    INNER JOIN clients on requests.vehicle_id = clients.vehicle_id
                    INNER JOIN users on clients.user_id = users.id
                    WHERE state = 'completed'
                    GROUP BY users.surname, users.name
                    ORDER BY SUM(services.cost) DESC LIMIT 1`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }
  // most expensive order
  async getMEOrder(req, res, next) {
    const query = `SELECT request_id, model, year, SUM(services.cost) FROM request_services
                    INNER JOIN requests on request_services.request_id = requests.id
                    INNER JOIN services on request_services.service_id = services.id
                    INNER JOIN clients on requests.vehicle_id = clients.vehicle_id
                    INNER JOIN vehicles on requests.vehicle_id = vehicles.id
                    INNER JOIN users on clients.user_id = users.id
                    WHERE state = 'completed'
                    GROUP BY model, year, request_id
                    ORDER BY SUM(services.cost) DESC LIMIT 1`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }
  // most repairs car
  async getMRVehicle(req, res, next) {

    const query = `SELECT model, year, COUNT(vehicles.id) FROM request_services
                    INNER JOIN requests on request_services.request_id = requests.id
                    INNER JOIN vehicles on requests.vehicle_id = vehicles.id
                    WHERE state = 'completed'
                    GROUP BY model, year
                    ORDER BY COUNT(vehicles.id) DESC LIMIT 1`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }
  // most popular service
  async getMPService(req, res, next) {
    const query = `SELECT services.name, COUNT(services.id) FROM request_services
                    INNER JOIN requests on request_services.request_id = requests.id
                    INNER JOIN services on request_services.service_id = services.id
                    WHERE state = 'completed'
                    GROUP BY services.name
                    ORDER BY COUNT(services.id) DESC LIMIT 1`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }
  // amount by specialization
  async getAmountBySpec(req, res, next) {
    const query = `SELECT COUNT(*), specialization FROM employees
                    GROUP BY specialization
                    ORDER BY COUNT(*) DESC`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }
  // services higher than avg
  async getHigherAvgService(req, res, next) {
    const query = `SELECT * FROM services
                    WHERE cost > (SELECT AVG(cost) from services)`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }
}

module.exports = new StatisticsController();
