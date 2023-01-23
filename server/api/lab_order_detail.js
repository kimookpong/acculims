const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + connection.threadId);
});

export default function handler(req, res) {
  let cond_ = '517861';
  //let cond_ = res.body.id;

  let query = `SELECT lab_head.department as department, 
  lab_head.lab_order_number as lab_order_number, 
  lab_head.hn, 
  concat(patient.pname,' ',patient.fname,' ',patient.lname) AS name, 
  FORMAT(timestampdiff(year,patient.birthday,curdate()),0) AS year, 
  FORMAT(timestampdiff(month,patient.birthday,curdate())-(timestampdiff(year,patient.birthday,curdate())*12),0) AS month, 
  if(patient.sex = 1,'ชาย','หญิง' ) AS SEX, 
  DATE_FORMAT(DATE_ADD(patient.birthday, INTERVAL 543 YEAR),'%d/%m/%Y') as birthday, 
  DATE_FORMAT(DATE_ADD(lab_head.order_date, INTERVAL 543 YEAR),'%d/%m/%Y') as order_date, 
  lab_head.order_time, 
  kskdepartment.department as room, 
  pttype.name as ptname, 
  doctor.name as docname, 
  if(trim(lab_head.department) ='IPD',ward.name,kskdepartment.department) as wardname, 
  lab_head.lab_head_remark 
  FROM lab_head 
  LEFT JOIN patient ON lab_head.hn = patient.hn 
  LEFT JOIN kskdepartment ON lab_head.order_department = kskdepartment.depcode 
  LEFT JOIN ovst ON lab_head.vn = ovst.vn 
  LEFT JOIN pttype ON ovst.pttype = pttype.pttype 
  LEFT JOIN lab_order ON lab_head.lab_order_number = lab_order.lab_order_number 
  LEFT JOIN doctor ON lab_head.doctor_code = doctor.code 
  LEFT JOIN ward ON lab_head.ward = ward.ward 
  WHERE lab_head.lab_order_number = '${cond_}' 
  GROUP BY lab_head.lab_order_number`;

  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.error(err);
      return;
    }
    res.status(200).json(rows)
  });
}
