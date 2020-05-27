// Need to add functionality to Add roles and add departments
// Want better way to do inquirers/con.querys without nesting them
// Joining tables to make it easier to grab data

const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');
const app = express();
const bodyParser = require('body-parser');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    port: 3306,
    database: "employeeTracker_db"
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
});

const whatToDoQuestions = [
    'View All Employees',
    'View All Employees By Department',
    'View All Employees By Role',
    'Add An Employee',
    'Add A Deparment',
    'Add A Role'
];

function start() {
    inquirer
        .prompt([
            {
                name: 'whatToDo',
                message: 'What do you want to do?',
                type: 'list',
                choices: whatToDoQuestions
            }
        ])
        .then(answer => {
            switch(answer.whatToDo) {
                case whatToDoQuestions[0]:
                    viewEmployees();
                    break;
                case whatToDoQuestions[1]:
                    viewEmployeesByDepartment();
                    break;
                case whatToDoQuestions[2]:
                    viewEmployeesByRole();
                    break;
                case whatToDoQuestions[3]:
                    addEmployee();
                    break;
                case whatToDoQuestions[4]:
                    addDepartment();
                    break;
                case whatToDoQuestions[5]:
                    addRole();
                    break;
            }
        })
};

function viewEmployees() {
    con.query("SELECT * FROM employee INNER JOIN role ON employee.role_id=role.id;", function (err, result) {
        if (err) throw err;
        console.table(result);
      });
};

function viewEmployeesByDepartment() {
    let departments = [];
    con.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;

        for (i = 0; i < result.length; i++) {
            departments.push(result[i]);
        }

        inquirer
        .prompt([
            {
                name: 'departmentName',
                message: 'Which deparment?',
                type: 'list',
                choices: departments
            }
        ])
        .then(answer => {
            const chosenDepartment = departments.find(department => department.name == answer.departmentName);
            let roleId;
            con.query(`SELECT id FROM role WHERE department_id = '${chosenDepartment.id};'`, function (err, result) {
                if (err) throw err;
                roleId = result[0].id;

                con.query(`SELECT * FROM employee WHERE role_id = ${roleId};`, function (err, result, fields) {
                    if (err) throw err;
                    console.table(result);
                    start();
                });
            });
        });
    })
};

function viewEmployeesByRole() {

    con.query('SELECT * FROM role', function (err, result) {
        let roles = [];
        for (i = 0; i < result.length; i++) {
            roles.push(result[i].title);
        };

        inquirer
        .prompt([
            {
                name: 'roleName',
                message: 'Which role?',
                type: 'list',
                choices: roles
            }
        ])
        .then(answer => {
            con.query(`SELECT id FROM role WHERE title = '${answer.roleName}'`, function (err, result) {
                if(err) console.log(err);
                let id = (result[0].id);

                con.query(`SELECT * FROM employee WHERE role_id = ${id}`, function (err, result) {
                    if(err) console.log(err);
                    console.table(result);
                });

            })
        });
        
    });
};

function addEmployee() {
    let employee = {};
    let roles = [];

    inquirer
        .prompt([{
            name: 'firstName',
            message: 'What is the employee\'s first name?',
            type: 'input'
        }])
        .then(answer => {
            employee.firstName = answer.firstName;

            inquirer
                .prompt([{
                    name: 'lastName',
                    message: 'What is the employee\'s last name?',
                    type: 'input'
                }])
                .then(answer => {

                    employee.lastName = answer.lastName;

                    con.query('SELECT title FROM role', (err, result) => {
                        if (err) console.log(err);
                        for (i = 0; i < result.length; i++) {
                            roles.push(result[i].title);
                        }

                        inquirer
                            .prompt([{
                                name: 'role',
                                message: 'What is your employee\'s role?',
                                type: 'list',
                                choices: roles
                            }])
                            .then(answer => {

                                con.query(`SELECT id FROM role WHERE title = '${answer.role}'`, function (err, result) {
                                    if(err) console.log(err);
                                    employee.role_id = result[0].id;
                                    let employees = [];

                                    con.query(`SELECT first_name, last_name FROM employee`, function (err, result) {
                                        if(err) console.log(err);
                                        
                                        for (i = 0; i < result.length; i++) {
                                            employees.push(`${result[i].first_name} ${result[i].last_name}`);
                                            
                                            inquirer
                                                .prompt([{
                                                    name: 'manager',
                                                    message: 'Who is their manager?',
                                                    type: 'list',
                                                    choices: employees
                                                }])
                                                .then(answer => {
                                                    employee.manager = answer.manager;
                                                    
                                                    con.query(`INSERT INTO employee (first_name, last_name, role_id, manager)
                                                        VALUES ("${employee.firstName}", "${employee.lastName}", "${employee.role_id}", "${employee.manager}");`, function (err, result) {
                                                        if (err) console.log(err);
                                                    });
                                                    
                                                })
                                                .catch(error => console.log(error));

                                        }

                                    });  

                                });
                            })
                            .catch(error => console.log(error));

                    })


                })
                .catch(error => console.log(error));

        })
        .catch(error => console.log(error))
    }

start();