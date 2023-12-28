const pool = require("../db");

class RequestController {
  async add(req, res, next) {
    const { vehicleId, orderDate } = req.body;

    const query = `INSERT INTO "requests"(vehicle_id, order_date)
                   VALUES($1, $2) 
                   RETURNING *`;

    const values = [vehicleId, orderDate];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            data: data.rows[0],
            message: "You successfully send request!",
          });
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

    const query = `DELETE FROM "requests" 
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
    const { vehicleId, orderDate, state } = req.body;

    const query = `UPDATE "requests" 
                   SET vehicle_id = $1, order_date = $2, state = $3
                   WHERE id = $4
                   RETURNING *`;

    const values = [vehicleId, orderDate, state, id];

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
    const query = `SELECT requests.id, model, year, phone_number, order_date, state FROM requests
                    INNER JOIN clients on requests.vehicle_id = clients.vehicle_id
                    INNER JOIN vehicles on requests.vehicle_id = vehicles.id 
                    INNER JOIN users on clients.user_id = users.id
                    WHERE requests.state = 'process'`;

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

  async getForProfile(req, res, next) {
    const id = req.params.id;
    const query = `SELECT requests.id as request_id, users.id, model, year, order_date, state FROM requests
                  INNER JOIN clients on requests.vehicle_id = clients.vehicle_id
                  INNER JOIN vehicles on requests.vehicle_id = vehicles.id
                  INNER JOIN users on clients.user_id = users.id
                  WHERE users.id = $1
    `;

    await pool.query(query, [id], (err, data) => {
      if (err) next(err);
      else {
        res.status(200).json({
          count: data.rowCount,
          data: data.rows,
        });
        console.log(`Count: ${data.rowCount}`);
      }
    });
  }

  async getById(req, res, next) {
    const id = req.params.id;

    const query = `SELECT * FROM "requests"
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

module.exports = new RequestController();
