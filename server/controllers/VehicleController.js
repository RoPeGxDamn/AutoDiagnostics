const pool = require("../db");
const chalk = require("chalk");

class VehicleController {
  async add(req, res, next) {
    const { model, year, vin, userId } = req.body;

    const addCarQuery = `INSERT INTO "vehicles"(model, year, vin) 
                         VALUES($1, $2, $3) 
                         RETURNING *`;

    const addClientQuery = `INSERT INTO "clients"(user_id, vehicle_id)
                            VALUES($1, $2) 
                            RETURNING *`;

    const values = [model, year, vin];

    const addCarTransaction = await pool.connect();
    try {
      addCarTransaction.query("BEGIN");

      const newCar = await addCarTransaction.query(addCarQuery, values);

      const newCarId = newCar.rows[0].id;

      const newClient = await addCarTransaction.query(addClientQuery, [
        userId,
        newCarId,
      ]);
      console.log(
        chalk.bgGreen("New client data: " + JSON.stringify(newClient.rows[0]))
      );

      await addCarTransaction.query("COMMIT", () => {
        return res.status(201).json({
          message: "You successfully added new car!",
        });
      });
    } catch (e) {
      await addCarTransaction.query("ROLLBACK");
      console.log(chalk.magenta("Add Car Transaction Error: " + e));
      return res.status(406).json({ message: e.message });
    } finally {
      addCarTransaction.release();
    }
  }

  async getAllByUserId(req, res, next) {
    const id = req.params.id;
    const query = `SELECT * FROM "clients" INNER JOIN "vehicles" ON "clients".vehicle_id="vehicles".id 
                   WHERE user_id = $1`;

    try {
      await pool.query(query, [id], (err, data) => {
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

  async remove(req, res, next) {
    const id = req.params.id;

    const query = `DELETE FROM "vehicles" 
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

    const { model, year, vin } = req.body;

    const query = `UPDATE "vehicles" 
                    SET model = $1, year = $2, vin = $3
                   WHERE id = $4
                   RETURNING *`;

    const values = [model, year, vin, id];

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
    const query = `SELECT * FROM "vehicles"`;

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

    const query = `SELECT * FROM "vehicles"
                WHERE id = $1`;

    try {
      await pool.query(query, [id], (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows[0]);
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

module.exports = new VehicleController();
