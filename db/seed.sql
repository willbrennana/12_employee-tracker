USE employees_db
INSERT INTO department (dept_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Account"),

INSERT INTO role (title, salary, dept_id)
VALUES ("Engineer", 150000, 1),
       ("Comptroller", 100000, 2),
       ("Paralegal", 70000, 3),
       ("Account Executive", 80000, 4),

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mark", "Zellner", 1, 2),
       ("Gretchen", "Duffy", 3, NULL),
       ("Daniel", "Mashburn", 4, 5),
       ("Amanda", "Willingham", 6, 7);