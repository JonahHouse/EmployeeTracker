CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager INT NOT NULL,
    PRIMARY KEY (id)
);

USE employeeTracker_db;

INSERT INTO department (name)
VALUES ("HR");

INSERT INTO role (title, salary, department_id)
VALUES ("Human Resources", 30000, 1);

INSERT INTO employee (id, first_name, last_name, role_id, manager)
VALUES ("John", "Doe", 1);