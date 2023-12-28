const pool = require("../db");
const chalk = require("chalk");

class ClientController {
  async add(req, res, next) {
    const { userId, vehicleId } = req.body;

    const query = `INSERT INTO "clients"(user_id, vehicle_id) 
                   VALUES($1, $2) 
                   RETURNING *`;

    const values = [userId, vehicleId];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
          console.log(data.rows[0]);
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(406).json({
        message: error.message,
      });
    }
  }

  async remove(req, res, next) {
    const id = req.params.id;

    const query = `DELETE FROM "clients" 
                     WHERE id = $1 RETURNING *`;

    try {
      await pool.query(query, [id], (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
          console.log(data.rows[0]);
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(406).json({
        message: error.message,
      });
    }
  }

  async update(req, res, next) {
    const id = req.params.id;
    const { userId, vehicleId } = req.body;

    const query = `UPDATE "clients" 
                   SET user_id = $1, vehicle_id = $2 
                   WHERE id = $3
                   RETURNING *`;

    const values = [userId, vehicleId, id];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
          console.log(data.rows[0]);
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(406).json({
        message: error.message,
      });
    }
  }

  async getAll(req, res, next) {
    const query = `SELECT surname, name, patronymic, phone_number, email, password, birth_date, username, COUNT(vehicle_id) as "car_count" FROM "clients"
                  INNER JOIN "users" on "clients".user_id = "users".id
                  GROUP BY surname, name, patronymic, phone_number, email, password, birth_date, username`;

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
    } catch (error) {
      console.log(error);
      return res.status(406).json({
        message: error.message,
      });
    }
  }

  async getById(req, res, next) {
    const id = req.params.id;

    const query = `SELECT * FROM "clients" 
                     WHERE id = $1`;

    try {
      await pool.query(query, [id], (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
          console.log(data.rows[0]);
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(406).json({
        message: error.message,
      });
    }
  }
}

module.exports = new ClientController();
