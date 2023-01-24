const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.PW,
    database: "employees_db",
  },
  console.log(`Connected to the employee database.`)
);

function anotherOne() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What are you looking to knock off your to-do list?",
        name: "choice",
        choices: [
          { name: "View all departments", value: "VIEW DEPARTMENTS" },
          { name: "View all roles", value: "VIEW ROLES" },
          { name: "View all employees", value: "VIEW EMPLOYEES" },
          { name: "Add a department", value: "ADD DEPARTMENT" },
          { name: "Add a role", value: "ADD ROLE" },
          { name: "Add an employee", value: "ADD EMPLOYEE" },
          { name: "Update employee info", value: "UPDATE EMPLOYEE INFO" },
          { name: "I'm all done (for now)", value: "EXIT" },
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

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    console.table(results);
    anotherOne();
  });
}

function viewRoles() {
  db.query(
    "SELECT role.id, role.title, role.salary, department.dept_name FROM role JOIN department ON role.dept_id = department.id",
    function (err, results) {
      console.table(results);
      console.log(err);
      anotherOne();
    }
  );
}

function viewEmployees() {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.dept_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.dept_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
    function (err, results) {
      console.table(results);
      anotherOne();
    }
  );
}

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
    managers.unshift({ name: "None", value: null });
    db.query("SELECT * FROM role", function (err, results) {
      const roles = results.map((role) => ({
        name: role.title,
        value: role.id,
      }));
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
  db.query("SELECT * FROM employee", function (err, results) {
    const employees = results.map((employee) => ({
      name: employee.first_name + " " + employee.last_name,
      value: employee.id,
    }));
    db.query("SELECT * FROM role", function (err, results) {
      const roles = results.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            message: "Whose title would you like to update?",
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
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [answer.role_id, answer.id],
            function (err, results) {
              console.table(results);
              console.table("Best of luck on their new venture!");
              anotherOne();
            }
          );
        });
    });
  });
}

anotherOne();
