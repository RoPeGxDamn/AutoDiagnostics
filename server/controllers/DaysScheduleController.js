const pool = require("../db");
const chalk = require("chalk");

class DaysScheduleController {
  async add(req, res, next) {
    const { dayOfWeek, startTime, endTime } = req.body;

    const query = `INSERT INTO "days_schedule"(day_of_week, start_time, end_time) 
                   VALUES($1, $2, $3) 
                   RETURNING *`;

    const values = [dayOfWeek, startTime, endTime];

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

    const query = `DELETE FROM "days_schedule" 
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
    const { dayOfWeek, startTime, endTime } = req.body;
    console.log(JSON.stringify(req.body));

    const query = `UPDATE "days_schedule" 
                   SET day_of_week = $1, start_time = $2, end_time = $3 
                   WHERE id = $4
                   RETURNING *`;

    const values = [dayOfWeek, startTime, endTime, id];

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
    const query = `SELECT * FROM "days_schedule"`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            data: data.rows,
            count: data.rowCount,
          });
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

    const query = `SELECT * FROM "days_schedule" 
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

module.exports = new DaysScheduleController();
