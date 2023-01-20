DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  dept_id INT NOT NULL,
  CONSTRAINT fk_dept FOREIGN KEY (dept_id) references department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  CONSTRAINT fk_role FOREIGN KEY (role_id) references role(id) ON DELETE CASCADE,
  manager_id INT,
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) references employee(id) ON DELETE SET NULL
);