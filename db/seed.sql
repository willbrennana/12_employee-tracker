USE employees_db;

INSERT INTO department (dept_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Account");

INSERT INTO role (title, salary, dept_id)
VALUES ("Engineer", 150000, 1),
       ("Comptroller", 100000, 2),
       ("Paralegal", 70000, 3),
       ("Account Executive", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mark", "Zellner", 1, 6),
("Zach", "Day", 2, 3),
("Amanda", "Willingham", 3, 2),
("Lauren", "Shandling", 4, 5),
("Kerri", "Soukup", 5, NULL);
