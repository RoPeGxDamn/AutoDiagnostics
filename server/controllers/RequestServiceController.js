const pool = require("../db");

class RequestServiceController {
  async add(req, res, next) {
    const { requestId, serviceId } = req.body;

    const query = `INSERT INTO "request_services"(request_id, service_id)
                   VALUES($1, $2) 
                   RETURNING *`;

    const values = [requestId, serviceId];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
          console.log(data.rows[0]);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async remove(req, res, next) {
    const id = req.params.id;

    const query = `DELETE FROM "request_services" 
                   WHERE id = $1 RETURNING *`;

    try {
      await pool.query(query, [id], (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
          console.log(data.rows[0]);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async update(req, res, next) {
    const id = req.params.id;
    const { requesId, serviceId, state } = req.body;

    const query = `UPDATE "request_services" 
                   SET request_id = $1, service_id = $2, state = $3
                   WHERE id = $4
                   RETURNING *`;

    const values = [requesId, serviceId, state, id];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
          console.log(data.rows[0]);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async getAll(req, res, next) {
    const query = `SELECT request_id, count(service_id) as service_count, users.name, phone_number, model, year, order_date, requests.state FROM request_services
                  INNER JOIN requests on request_services.request_id=requests.id
                  INNER JOIN services on request_services.service_id = services.id
                  INNER JOIN clients on requests.vehicle_id = clients.vehicle_id
                  INNER JOIN vehicles on requests.vehicle_id = vehicles.id
                  INNER JOIN users on clients.user_id = users.id
                  WHERE requests.state = 'accepted'					
                  GROUP BY request_id, users.name, phone_number, model, year, order_date, state`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            count: data.rowCount,
            data: data.rows,
          });
          console.log(`Count: ${data.rowCount}`);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async getById(req, res, next) {
    const id = req.params.id;

    const query = `SELECT * FROM "request_services"
                    WHERE id = $1`;

    try {
      await pool.query(query, [id], (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }
}

module.exports = new RequestServiceController();
