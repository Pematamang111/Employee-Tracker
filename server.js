const express = require('express');
const inquirer = require('inquirer');
//require pool og pg to connect
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
  {
    //PostgreSQL username and password
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
)

pool.connect();

function question(){
inquirer
.prompt({
    type: 'list',
    name: 'receive',
    message: 'Select the following options:',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 
        'add a role', 'add an employee', 'update an employee role']
}
)
.then((data) => {
if (data.receive === 'view all departments') {
   //department names and department ids
   const dpt = 'SELECT * FROM department;';
   pool.query(dpt, function(err, {rows}){
    console.table(rows);
   })
} else if (data.receive === 'view all roles') {
    //job title, role id, the department that role belongs to, and the salary for that role
  const role = 'SELECT * FROM role;';
  pool.query(role, function(err, {rows}){
    console.table(rows);
  })
} else if (data.receive === 'view all employees'){
    //employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
   const employees = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.id, department.name, employee.manager_id   
                      FROM employee
                      JOIN role ON role.id = employee.role_id
                    JOIN department ON department.id = role.department_id;`
  pool.query(employees, function(err, {rows}){
console.table(rows);
})
} else if (data.receive === 'add a department') {
    inquirer
    .prompt({
        type: 'input',
        name: 'deptValue',
        message:  'Enter the name of the department'
    }
    )
    .then((data) => {
       pool.query(`INSERT INTO department (name) VALUES ($1) RETURNING id, name;`, [data.deptValue], function(err, { rows }){
         console.log(rows);
         console.table(rows);
        })


    })
    .catch((err) => console.log(err));
} else if (data.receive ==='add a role'){
    inquirer
    .prompt([{
        type: 'input',
        name: 'title',
        message: 'Enter the position name/title'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary'
    },
    {
        type: 'input',
        name: 'dptName',
        message: 'Enter the department name'

    }]
)
    .then((data) => {
        pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id, title, salary, department_id;', [data.title, data.salary, data.dptName], function(err, {rows}){
            console.table(rows);
        })
    })
    .catch((err) => console.log(err));
}   else if (data.receive ==='add an employee'){
    inquirer
    .prompt([{
        type: 'input',
        name: 'fName',
        message: 'Enter the first name'
    },
    {
        type: 'input',
        name: 'lname',
        message: 'Enter the last name'
    },
    {
        type: 'input',
        name: 'managerid',
        message: 'Enter manager id'
    },
    {
        type: 'input',
        name: 'roleid',
        message: 'Enter role'
    }]
)
.then((data) => {
    pool.query('INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, manager_id, role_id;', [data.fName, data.lName, data.managerid, data.roleid], function(err, {rows}){
        console.table(rows);
    })
})
.catch((err) => console.log(err));
} else if (data.receive === 'update an employee role') {
    inquirer
    .prompt([{
        type: 'input',
        message: 'Enter the employee id to select an employee to update and their new role',
        name: 'employeeid'
    },
    {   type: 'input',
        name: 'firstName',
        message: 'Enter first name'
    },
    {
        type: 'input',
        name: 'lastName',
        message: 'Enter Last Name'
    },
    {
        type: 'input',
        name: 'role',
        message: 'Enter the role id'
    }]
)
.then((data) => {
     const allEmployee = `SELECT * FROM employee WHERE employee.id =${data.employeeid} ;`;
     const update = 'UPDATE employee SET first_name = $1, last_name = $2, role_id = $3 WHERE id = $4';
     pool.query(allEmployee,  function(err, {rows}){
        console.table(rows);
        pool.query(update, [data.firstName, data.lastName, data.role], function(err, {rows}){
            console.table(rows);
        })
    })
})
.catch((err) => console.log(err));
}


} )
.catch((err) => console.log(err));
};

question();





app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  