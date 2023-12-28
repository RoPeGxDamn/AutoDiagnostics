const pool = require("../db");

class ServiceController {
  async add(req, res, next) {
    const { name, description, cost } = req.body;

    const query = `INSERT INTO "services"(name, description, cost) 
                   VALUES($1, $2, $3) 
                   RETURNING *`;

    const values = [name, description, cost];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            data: data.rows[0],
            message: "You successfully added service!",
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

    const query = `DELETE FROM "services" 
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

    const { name, description, cost } = req.body;

    const query = `UPDATE "services" 
                   SET name = $1, description = $2, cost = $3 
                   WHERE id = $4
                   RETURNING *`;

    const values = [name, description, cost, id];

    
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
    const query = `SELECT * FROM "services"`;

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

    const query = `SELECT * FROM "services"
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

module.exports = new ServiceController();
