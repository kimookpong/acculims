const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  password: "",
  host: "localhost",
  database: "acculims2",
});

app.post("/lab_order_detail", (req, res) => {
  const id = req.body.id;
  const query = `SELECT 
  lab_head.lab_order_number as order_number,
  lab_head.receive_status as h_status,
  lab_head.hn as HN,
  lab_head.hn as patient_name,
  lab_head.approver_name as approver_name,
  lab_head.approved_date as approved_date,
  lab_head.approved_time as approved_time,
  lab_head.ward as ward,
  lab_head.lab_head_remark as remark,
  lab_head.form_name as form_name,
  lab_head.lab_priority_id as priority,
  lab_head.lis_order_no as No,
  concat(
    DATE_FORMAT(lab_head.order_date, '%Y-%m-%d'), ' ',
    DATE_FORMAT(lab_head.order_time,'%H:%i'))
    AS order_date_time,
 concat(
    DATE_FORMAT(lab_head.receive_date, '%Y-%m-%d'), ' ',
    DATE_FORMAT(lab_head.receive_time,'%H:%i'))
    AS time_receive_report,
  lab_head.department as department
  FROM lab_head
  LEFT JOIN lab_order ON lab_order.lab_order_number = lab_head.lab_order_number 
  WHERE lab_head.lab_order_number =  ${id} 
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

app.post("/lab_barcode", (req, res) => {
  const id = req.body.id;
  if (id.length > 0) {
    const query = `SELECT
      lab_head.lab_order_number as order_number,
      concat(patient.pname, '', patient.fname, ' ', patient.lname) AS patient_name,
      lab_order.barcode as barcode,
      concat(
        DATE_FORMAT(lab_head.order_date, '%Y-%m-%d'), ' ',
        DATE_FORMAT(lab_head.order_time,'%H:%i'))
        AS order_date_time
      FROM lab_head
      LEFT JOIN lab_order ON lab_order.lab_order_number = lab_head.lab_order_number
      LEFT JOIN patient ON lab_head.hn = patient.hn
      WHERE lab_head.lab_order_number in  (${id.join()})
      AND lab_head.receive_status <> 'Delete'
      GROUP BY lab_head.lab_order_number`;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  }
});

app.post("/lab_order", (req, res) => {
  const date_start = req.body.date_start;
  const date_stop = req.body.date_stop;

  const time_start = req.body.time_start;
  const time_stop = req.body.time_stop;

  const department = req.body.department;
  const type = req.body.type;
  const text = req.body.text;

  const form_name = req.body.form_name;

  let cond = ` WHERE lab_head.order_date <= '${date_stop}' AND lab_head.order_date >= '${date_start}' `;
  // cond =
  //   cond +
  //   ` AND lab_head.order_time <= '${time_stop}' AND lab_head.order_time >= '${time_start}' `;
  if (department === "OPD") {
    cond = cond + ` AND lab_head.department = '${department}' `;
  } else if (department === "IPD") {
    cond = cond + ` AND lab_head.department = '${department}' `;
  }
  if (text === null) {
  } else {
    if (type === 1) {
      cond = cond + ` AND lab_order.barcode LIKE '%${text}%' `;
    } else if (type === 2) {
      cond = cond + ` AND lab_head.hn LIKE '%${text}%' `;
    } else if (type === 3) {
      cond =
        cond +
        ` AND (patient.fname LIKE '%${text}%' OR patient.lname LIKE '%${text}%') `;
    }
  }

  if (form_name === "All") {
  } else {
    cond = cond + ` AND lab_head.form_name LIKE '%${form_name}%' `;
  }

  const query = `SELECT 
  lab_head.lab_order_number as order_number,
  lab_head.receive_status as h_status,
  lab_head.hn as HN,
  concat(patient.pname, '', patient.fname, ' ', patient.lname) AS patient_name,
  lab_head.form_name as form_name,
  concat(
    if(lab_head.lab_priority_id = 0, 'ปกติ', ''),
    if(lab_head.lab_priority_id = 1, 'ปกติ', ''),
    if(lab_head.lab_priority_id = 2, 'ด่วน', ''),
    if(lab_head.lab_priority_id = 3, 'ด่วนที่สุด', ''))
    AS priority,
  lab_head.lis_order_no as No,
  concat(
    DATE_FORMAT(lab_head.order_date, '%Y-%m-%d'), ' ',
    DATE_FORMAT(lab_head.order_time,'%H:%i'))
    AS order_date_time,
 concat(
    DATE_FORMAT(lab_head.receive_date, '%Y-%m-%d'), ' ',
    DATE_FORMAT(lab_head.receive_time,'%H:%i'))
    AS time_receive_report,
  lab_head.department as department
  FROM lab_head
  LEFT JOIN lab_order ON lab_order.lab_order_number = lab_head.lab_order_number 
  LEFT JOIN patient ON lab_head.hn = patient.hn
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

app.get("/lab_items_group", (req, res) => {
  const query = `SELECT 
  lab_items_group_name AS value,
  lab_items_group_name AS label
  FROM lab_items_group`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/lab_form_head", (req, res) => {
  const query = `SELECT 
  form_name AS value,
  form_name AS label
  FROM lab_form_head`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/action_event", (req, res) => {
  const action = req.body.action;
  let text = "";
  if (action === "accept") {
    text = "รับใบ LAB เรียบร้อยแล้ว";
  } else if (action === "cancel") {
    text = "ยกเลิกใบ LAB เรียบร้อยแล้ว";
  } else if (action === "delete") {
    text = "ลบใบ LAB เรียบร้อยแล้ว";
  }
  res.send({ result: true, alert: text });
});

app.listen("3001", () => {
  console.log("Server is running on port 3001");
});
