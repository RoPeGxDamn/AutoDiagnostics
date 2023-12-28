const pool = require("../db");

class ResultController {
  async add(req, res, next) {
    const { requestId, employeeId, completeDate, comment } = req.body;

    const query = `INSERT INTO "results"(request_id, employee_id, complete_date, comment) 
                   VALUES($1, $2, $3, $4) 
                   RETURNING *`;

    const values = [requestId, employeeId, completeDate, comment];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            data: data.rows[0],
            message: "You successfully created an order!",
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

    const query = `DELETE FROM "results" 
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

    const { requestId, employeeId, completeDate, comment } = req.body;

    const query = `UPDATE "results" 
                   SET request_id = $1, employee_id = $2, complete_date = $3, comment = $4
                   WHERE id = $5
                   RETURNING *`;

    const values = [requestId, employeeId, completeDate, comment, id];

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
    const query = `SELECT results.id, model, year, users.surname, users.name, complete_date, comment FROM results
                  INNER JOIN requests on results.request_id=requests.id
                  INNER JOIN vehicles on requests.vehicle_id = vehicles.id
                  INNER JOIN employees on results.employee_id= employees.id
                  INNER JOIN users on employees.user_id = users.id`;

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

  async getForFeedback(req, res, next) {
    const id = req.params.id;

    const query = `SELECT request_id, users.id, model, year, complete_date, state FROM results
                      INNER JOIN requests on results.request_id = requests.id
                      INNER JOIN clients on requests.vehicle_id = clients.vehicle_id
                      INNER JOIN vehicles on requests.vehicle_id = vehicles.id
                      INNER JOIN users on clients.user_id = users.id
                      WHERE users.id = $1 AND state = 'completed'`;

    try {
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
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async getById(req, res, next) {
    const id = req.params.id;

    const query = `SELECT * FROM "results"
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

module.exports = new ResultController();
