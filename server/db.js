// server/db.js
const mysql = require("mysql2");
const util = require('util');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ifprquedas",
  database: "carepet"
});

db.connect(err => {
  if (err) {
    console.error("❌ Erro MySQL:", err);
  } else {
    console.log("✅ Conectado ao MySQL!");
  }
});

db.query = util.promisify(db.query);


module.exports = db;
