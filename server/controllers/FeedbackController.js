const pool = require("../db");

class FeedbackController {
  async add(req, res, next) {
    const { requestId, clientId, rate, description } = req.body;
    console.log(JSON.stringify(req.body));

    const query = `INSERT INTO feedback(request_id, client_id, rate, description) 
                   VALUES($1, $2, $3, $4) 
                   RETURNING *`;

    const values = [requestId, clientId, rate, description];

    try {
      await pool.query(query, values, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            data: data.rows[0],
            message: "You successfuly send feedback!",
          });
          console.log(data.rows[0]);
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(406).json({ message: error.message });
    }
  }

  async remove(req, res, next) {
    const id = req.params.id;

    const query = `DELETE FROM "feedback" 
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
      return res.status(406).json({ message: error.message });
    }
  }

  async update(req, res, next) {
    const id = req.params.id;

    const { requestId, clientId, rate, description, createdAt } = req.body;

    const query = `UPDATE "feedback" 
                   SET request_id = $1, client_id = $2, rate = $3, description = $4, createdAt = $5
                   WHERE id = $6
                   RETURNING *`;

    const values = [requestId, clientId, rate, description, createdAt, id];

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
    const query = `SELECT * FROM "feedback"
                  INNER JOIN clients on feedback.client_id = clients.id
                  INNER JOIN users on clients.user_id = users.id`;

    try {
      await pool.query(query, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json({
            count: data.rowCount,
            data: data.rows,
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(406).json({ message: error.message });
    }
  }

  async getForProfile(req, res, next) {
    const id = req.params.id;

    const query = `SELECT * FROM "feedback"
                    WHERE client_id = $1`;

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
    } catch (error) {
      console.log(error);
      return res.status(406).json({ message: error.message });
    }
  }

  async getById(req, res, next) {
    const id = req.params.id;

    const query = `SELECT * FROM "feedback"
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
      return res.status(406).json({ message: error.message });
    }
  }
}

module.exports = new FeedbackController();
