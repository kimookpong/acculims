const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  database: "acculims",
});

app.post("/lab_order", (req, res) => {
  const date_start = req.body.date_start;
  const date_stop = req.body.date_stop;
  const department = req.body.department;
  const type = req.body.type;
  const text = req.body.text;

  let cond = ` WHERE order_date <= '${date_stop}' AND order_date >= '${date_start}' `;
  if (department === "OPD") {
    cond = cond + ` AND lab_head.department = '${department}' `;
  } else if (department === "IPD") {
    cond = cond + ` AND lab_head.department = '${department}' `;
  }
  if (text === null) {
  } else {
    if (type === 1) {
      //cond = cond + ` AND barcode LIKE '%${text}%' `;
    } else if (type === 2) {
      cond = cond + ` AND lab_head.hn LIKE '%${text}%' `;
    } else if (type === 3) {
      //cond = cond + ` AND name LIKE '%${text}%' `;
    }
  }

  const query = `SELECT 
  lab_head.lab_order_number as order_number,
  lab_head.receive_status as h_status,
  lab_head.hn as HN,
  lab_head.hn as patient_name,
  lab_head.form_name as form_name,
  lab_head.lab_priority_id as priority,
  lab_head.lis_order_no as No,
  lab_head.order_date as order_date_time,
  lab_head.receive_date as time_receive_report,
  lab_head.department as department
  FROM lab_head

  ${cond} 
  AND lab_head.receive_status <> 'Delete'
  GROUP BY lab_head.lab_order_number`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen("3001", () => {
  console.log("Server is running on port 3001");
});
