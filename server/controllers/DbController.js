const pool = require("../db");
const { promisify } = require("util");
const Docxtemplater = require("docxtemplater");
var PizZip = require("pizzip");
const blobToBuffer = require("blob-to-buffer");
const buf = require("node:buffer");

const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

class EmployeeController {
  async makeSqlQuery(req, res, next) {
    const { sqlQuery } = req.body;

    try {
      await pool.query(sqlQuery, (err, data) => {
        if (err) next(err);
        else {
          res.status(200).json(data.rows);
        }
      });
    } catch (e) {
      return res.status(406).json({
        message: e.message,
      });
    }
  }

  async makeOrderReport(req, res, next) {
    const id = req.params.id;

    const query = `SELECT * FROM results
                  INNER JOIN employees on results.employee_id = employees.id 
                  INNER JOIN users on employees.user_id = users.id
                  WHERE results.id = $1`;
    const vehicleQuery = `SELECT vehicles.model, vehicles.year FROM results
                          INNER JOIN requests on results.request_id = requests.id
                          INNER JOIN vehicles on requests.vehicle_id = vehicles.id
                          WHERE results.id = $1`;
    const orderSumQuery = `SELECT SUM(cost) as sum FROM request_services
                          INNER JOIN services on request_services.service_id = services.id
                          WHERE request_id = $1`;
    const servicesQuery = `SELECT name FROM request_services
                          INNER JOIN services on request_services.service_id = services.id
                          WHERE request_id = $1`;
    try {
      const templateContent = await readFileAsync(
        "templates/order-template.docx",
        "binary"
      );

      const zip = new PizZip(templateContent);
      const doc = new Docxtemplater(zip, { linebreaks: true });

      const requestInfo = (await pool.query(query, [id])).rows[0];
      const vehicleInfo = (await pool.query(vehicleQuery, [id])).rows[0];
      const orderSum = (
        await pool.query(orderSumQuery, [requestInfo.request_id])
      ).rows[0];
      const services = (
        await pool.query(servicesQuery, [requestInfo.request_id])
      ).rows;
      let arr = services.map(item => item.name)

      doc.render({
        requestId: requestInfo.id,
        completeDate: new Date(requestInfo.complete_date).toLocaleDateString('Gb-en'),
        comment: requestInfo.comment,
        vehicle: vehicleInfo.model + " " + vehicleInfo.year,
        mechanic: requestInfo.surname + " " + requestInfo.name,
        sum: orderSum.sum,
        services: Array(arr).join("; "),
      });
      const generatedDoc = doc
        .getZip()
        .generate({ type: "nodebuffer", compression: "DEFLATE" });
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=order-report-${id}.docx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.send(generatedDoc);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new EmployeeController();
