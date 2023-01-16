DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY_KEY,
  dept_name VARCHAR(30) UNIQUE NOT NULL,
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary VARCHAR(30) NOT NULL,
  dept_id INT UNSIGNED NOT NULL,
  CONSTRAINT fk_dept FOREIGN KEY (dept_id) references department(id) ON DELETE CASCADE,
);

CREATE TABLE employee (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY_KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  CONSTRAINT fk_role FOREIGN KEY (role_id) references role(id) ON DELETE CASCADE,
  manager_id INT UNSIGNED,
  CONSTRAINT fk_manager FOREIGN KEY (role_id) references role(id) ON DELETE NOT NULL,
);