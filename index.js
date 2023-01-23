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
  console.log(`Connected to the employee database.`)
);

// Funciton to loop prompts
function anotherOne() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What are you looking to check out or do?",
        name: "choice",
        choices: [
          { name: "All departments", value: "VIEW DEPARTMENTS" },
          { name: "All roles", value: "VIEW ROLES" },
          { name: "All employees", value: "VIEW EMPLOYEES" },
          { name: "Add a department", value: "ADD DEPARTMENT" },
          { name: "Add a role", value: "ADD ROLE" },
          { name: "Add an employee", value: "ADD EMPLOYEE" },
          { name: "Update an employee's info", value: "UPDATE EMPLOYEE INFO" },
          { name: "I'm outta here", value: "EXIT" },
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
      if (response.choice === "ADD DEPARTMENT") {
        addDepartment();
        console.log("I'm in");
      }
      if (response.choice === "ADD ROLE") {
        addRole();
      }
      if (response.choice === "ADD EMPLOYEE") {
        addEmployee();
      }
      if (response.choice === "UPDATE EMPLOYEE INFO") {
        updateEmployeeInfo();
      }
      if (response.choice === "EXIT") {
        process.exit();
      }
    });
}

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

// Function to Add Department
function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the department name?",
        name: "dept_name",
      },
    ])
    .then((answer) => {
      db.query("INSERT INTO department SET ?", answer, function (err, results) {
        console.table(results);
        console.log("New day. New department. Good stuff.");
        anotherOne();
      });
    });
}

// Function to Add Role
function addRole() {
  db.query("SELECT * FROM department", function (err, results) {
    const departments = results.map((department) => ({
      name: department.dept_name,
      value: department.id,
    }));
    console.log(departments);
    inquirer
      .prompt([
        {
          message: "What is the title?",
          name: "title",
        },
        {
          message: "What is the salary?",
          name: "salary",
        },
        {
          type: "list",
          message: "To what department does the role belong?",
          name: "dept_id",
          choices: departments,
        },
      ])
      .then((answer) => {
        db.query("INSERT INTO role SET ?", answer, function (err, results) {
          console.table(results);
          console.log("You're all set! Next stop: Interviews.");
          anotherOne();
        });
      });
  });
}

function addEmployee() {
  db.query("SELECT * FROM employee", function (err, results) {
    const managers = results.map((manager) => ({
      name: manager.first_name + " " + manager.last_name,
      value: manager.id,
    }));
    db.query("SELECT * FROM role", function (err, results) {
      const roles = results.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      console.log(managers, roles);
      inquirer
        .prompt([
          {
            message: "What's their first name?",
            name: "first_name",
          },
          {
            message: "And their last name?",
            name: "last_name",
          },
          {
            type: "list",
            message: "What's their title?",
            name: "role_id",
            choices: roles,
          },
          {
            type: "list",
            message: "Who's their manager?",
            name: "manager_id",
            choices: managers,
          },
        ])
        .then((answer) => {
          console.log(answer);
          db.query(
            "INSERT INTO employee SET ?",
            answer,
            function (err, results) {
              console.table(results);
              console.table("Congrats on growing your team!");
              anotherOne();
            }
          );
        });
    });
  });
}

function updateEmployeeInfo() {
  db.query(
    "SELECT role.id, role.title, employee.id, employee.first_name, employee.last_name FROM role INNER JOIN employee ON role.id = employee.role_id;",
    function (err, results) {
      const employees = results.map((employee) => ({
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      }));
      const roles = results.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      console.log(employees);
      inquirer
        .prompt([
          {
            type: "list",
            message: "Whose title would you like to update'?",
            name: "id",
            choices: employees,
          },
          {
            type: "list",
            message: "What's their new title?",
            name: "role_id",
            choices: roles,
          },
        ])
        .then((answer) => {
          console.log(answer);
          db.query(
            "INSERT INTO employee SET answer.role_id WHERE id = answer.id",
            answer,
            function (err, results) {
              console.table("Best of luck on their new venture!");
              anotherOne();
            }
          );
        });
    }
  );
}

anotherOne();
