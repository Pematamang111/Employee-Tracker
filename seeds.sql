INSERT INTO department (name)
VALUES ('electronic');

INSERT INTO role (title, salary, department_id) 
VALUES ('manager', 7000, 1),
       ('sales associate', 4000, 1);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ('Oscar', 'Gonzalez', 1, 1),
       ('Ernesto', 'Mejia', NULL, 2);

       SELECT * FROM department;
       SELECT * FROM role;
       SELECT * FROM employee;