const pool = require("../db");
const chalk = require("chalk");

class EmployeesScheduleController {
  async add(req, res, next) {
    const { daysScheduleId, employeeId } = req.body;

    const query = `INSERT INTO "employees_schedule"(days_schedule_id, employee_id) 
                   VALUES($1, $2)
                   RETURNING *`;

    const values = [daysScheduleId, employeeId];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            data: data.rows[0],
            message: "You successfully edit schedule!",
          });
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

    const query = `DELETE FROM "employees_schedule" 
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
    const { dayOfWeek, employeeId } = req.body;
    console.log(JSON.stringify(req.body));

    const query = `UPDATE "employees_schedule" 
                   SET day_of_week = $1, employee_id = $2
                   WHERE id = $3
                   RETURNING *`;

    const values = [dayOfWeek, employeeId, id];

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
    const query = `SELECT surname, name, patronymic, specialization, day_of_week, start_time, end_time FROM employees_schedule
        INNER JOIN employees on employees_schedule.employee_id = employees.id
        INNER JOIN days_schedule on employees_schedule.days_schedule_id = days_schedule.id
        INNER JOIN users on employees.user_id = users.id`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            data: data.rows,
            count: data.rowCount,
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

    const query = `SELECT * FROM "employees_schedule" 
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

module.exports = new EmployeesScheduleController();
