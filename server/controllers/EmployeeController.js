const pool = require("../db");
const chalk = require("chalk");
const cryptoJS = require("crypto-js");

class EmployeeController {
  async add(req, res, next) {
    const {
      username,
      password,
      repeatPassword,
      surname,
      name,
      patronymic,
      birthDate,
      phoneNumber,
      email,
      address,
      employmentDate,
      specialization,
    } = req.body;

    const isEqual = password == repeatPassword;

    const addUserQuery = `INSERT INTO "users"(surname, name, patronymic, birth_date, phone_number, username, email, password) 
                                        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const addEmployeeQuery = `INSERT INTO "employees"(user_id, address, employment_date, specialization) 
                   VALUES($1, $2, $3, $4) 
                   RETURNING *`;

    const addEmployeeTransaction = await pool.connect();
    try {
      addEmployeeTransaction.query("BEGIN");

      if (!isEqual) {
        throw new Error("Passwords are not equal!");
      }
      const encryptPass = String(
        cryptoJS.AES.encrypt(password, process.env.PASS_KEY)
      );

      const userValues = [
        surname,
        name,
        patronymic,
        birthDate,
        phoneNumber,
        username,
        email,
        encryptPass,
      ];

      const newUser = await addEmployeeTransaction.query(
        addUserQuery,
        userValues
      );

      const employeeValues = [
        newUser.rows[0].id,
        address,
        employmentDate,
        specialization,
      ];

      const newEmployee = await addEmployeeTransaction.query(
        addEmployeeQuery,
        employeeValues
      );

      console.log(
        chalk.bgGreen(
          "New employee data: " + JSON.stringify(newEmployee.rows[0])
        )
      );

      await addEmployeeTransaction.query("COMMIT", () => {
        return res.status(201).json({
          message: "You successfully added new employee!",
        });
      });
    } catch (e) {
      await addEmployeeTransaction.query("ROLLBACK");
      console.log(chalk.magenta("Add Employee Transaction Error: " + e));
      return res.status(406).json({ message: e.message });
    } finally {
      addEmployeeTransaction.release();
    }
  }

  async remove(req, res, next) {
    const id = req.params.id;

    const query = `DELETE FROM "users" 
                     WHERE id = $1 RETURNING *`;

    try {
      await pool.query(query, [id], (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            data: data.rows[0],
            message: "You successfully dismiss employee!",
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(406).json({ message: error.message });
    }
  }

  async update(req, res, next) {
    const id = req.params.id;
    const { userId, address, employmentDate, specialization } = req.body;
    console.log(JSON.stringify(req.body));

    const query = `UPDATE "employees" 
                   SET userId = $1, address = $2, employmentDate = $3, specialization = $4 
                   WHERE id = $5
                   RETURNING *`;

    const values = [userId, address, employmentDate, specialization, id];

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
      return res.status(406).json({ message: error.message });
    }
  }

  async getAll(req, res, next) {
    const query = `SELECT employees.id, user_id, surname, name, patronymic, phone_number, email, password, birth_date, username, address, employment_date, specialization FROM "employees"
            INNER JOIN "users" on "employees".user_id = "users".id`;

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
      return res.status(406).json({ message: error.message });
    }
  }

  async getById(req, res, next) {
    const id = req.params.id;

    const query = `SELECT * FROM "employees" 
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
      return res.status(406).json({ message: error.message });
    }
  }
}

module.exports = new EmployeeController();
