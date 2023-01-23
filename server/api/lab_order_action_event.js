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
  //let cond_id = res.body.id;
  //let cond_ = res.body.acion;
  let cond_id = ['517861','517862'];
  let cond_ = 'accept';

  let query = '';

  //for(let i=0;i<cond_id.length;i++){
    if(cond_ === 'accept'){
      query = `UPDATE lab_order SET report_status = '${cond_}' WHERE lab_order_number IN (${cond_id.join()})`;
    }
    else if(cond_ === 'cancel'){
      query = `UPDATE lab_order SET report_status = '${cond_}' WHERE lab_order_number IN (${cond_id.join()})`;
    }
    else if(cond_ === 'delete'){
      query = `UPDATE lab_order SET report_status = '${cond_}' WHERE lab_order_number IN (${cond_id.join()})`;
    }
    
    connection.query(query, function(err, rows, fields) {
      if (err) {
        console.error(err);
        return;
      }
      res.status(200).json(rows)
    });

    console.log('query =',query);
  }
//}