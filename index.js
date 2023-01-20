const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: process.env.PW,
    database: "employees_db",
  },
  console.log(`Connected to the tracker database.`)
);

// Function to View Departments
function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
}

// Function to View Roles
function viewRoles() {
  db.query("SELECT * FROM role", function (err, results) {
    console.table(results);
  });
}

// Function to View Employees
function viewEmployees() {
  db.query("SELECT * FROM employee", function (err, results) {
    console.table(results);
  });
}

inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to view?",
      name: "choice",
      choices: [
        { name: "All departments", value: "VIEW DEPARTMENTS" },
        { name: "All roles", value: "VIEW ROLES" },
        { name: "All employees", value: "VIEW EMPLOYEES" },
      ],
    },
  ])

  .then((response) => {
    if (response.choice === "VIEW DEPARTMENTS") {
      viewDepartments();
    }
    if (response.choice === "VIEW ROLES") {
      viewRoles();
    }
    if (response.choice === "VIEW EMPLOYEES") {
      viewEmployees();
    }
  });
