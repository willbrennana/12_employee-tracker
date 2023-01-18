const mysql = require("mysql2");

// Connect to database
const connection = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "letsgo1025",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`),
  connection.connect(function (err) {
    if (err) throw err;
  })
);

module.exports = connection;
