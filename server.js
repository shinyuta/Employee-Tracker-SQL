// Importing dependencies
const inquirer = require('inquirer');
const conTable = require('console.table');
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: '', // reminder: remove password. Add password back in.
    database: 'employee_db',
  },
  console.log('Connection successful to the employee database.')
);

db.connect(function (err) {
  if (err) throw err;

  console.log('╔═══╗    ╔╗                      ╔═══╗      ╔╗      ╔╗');
  console.log('║╔══╝    ║║                      ╚╗╔╗║     ╔╝╚╗     ║║');
  console.log('║╚══╗╔╗╔╗║║ ╔══╗╔╗ ╔╗╔══╗╔══╗     ║║║║╔══╗ ╚╗╔╝╔══╗ ║╚═╗╔══╗ ╔══╗╔══╗');
  console.log('║╔══╝║╚╝║║║ ║╔╗║║║ ║║║╔╗║║╔╗║     ║║║║╚ ╗║  ║║ ╚ ╗║ ║╔╗║╚ ╗║ ║══╣║╔╗║');
  console.log('║╚══╗║║║║║╚╗║╚╝║║╚═╝║║║═╣║║═╣    ╔╝╚╝║║╚╝╚╗ ║╚╗║╚╝╚╗║╚╝║║╚╝╚╗╠══║║║═╣');
  console.log('╚═══╝╚╩╩╝╚═╝╚══╝╚═╗╔╝╚══╝╚══╝    ╚═══╝╚═══╝ ╚═╝╚═══╝╚══╝╚═══╝╚══╝╚══╝');
  console.log('                ╔═╝║                                                 ');
  console.log('                ╚══╝                                                 ');

  Question();
});

function Question() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'introduction',
        message: 'Please select an option',
        choices: [
          'View All Active Employees',
          'Add Employee',
          // 'Remove Employee' *Feature to be added in future*
          'Update Employee',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
          'Quit',
        ],
      },
    ])
    .then((answer) => {
      //switch depending on case (https://www.w3schools.com/js/js_switch.asp)
      switch (answer.introduction) {

        case 'View All Active Employees':
          viewEmployees();
          break;

        case 'Add Employee':
          addEmployee();
          break;

        case 'Update Employee':
          updateEmployee();
          break;

        case 'View All Roles':
          viewRoles();
          break;

        case 'Add Role':
          addRole();
          break;

        case 'View All Departments':
          viewDepartments();
          break;

        case 'Add Department':
          addDepartment();
          break;

        case 'Quit':
          console.log('Session has ended.');
          db.end();
          break;
      }
    });
}

// Add Options
function addEmployee() {
  const sqlRole = `SELECT * FROM role`;
  db.query(sqlRole, (err, res) => {
    roleList = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    const sqlEmp = `SELECT * FROM employee WHERE manager_id IS NULL`;
    db.query(sqlEmp, (err, res) => {
      managerList = res.map((employee) => ({
        name: employee.first_name.concat(' ', employee.last_name),
        value: employee.id,
      }));

      return inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: 'What is the first name of your employee?',
          },
          {
            type: 'input',
            name: 'last_name',
            message: 'What is the last name of your employee?',
          },
          {
            type: 'list',
            name: 'role',
            message: 'What was your employee hired on as?',
            choices: roleList,
          },
          {
            type: 'list',
            name: 'manager',
            message: 'Which manager does the employee report to?',
            choices: managerList,
          },
        ])
        .then((answers) => {
          const sqlCreate = `INSERT INTO employee SET first_name='${answers.first_name}', last_name='${answers.last_name}', role_id=${answers.role}, manager_id = ${answers.manager};`;
          db.query(sqlCreate, (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(`Added ${answers.first_name} to our database!`);
            Question();
          });
        });
    });
  });
}

function addRole() {
  const sqlDept = `SELECT * FROM department`;
  db.query(sqlDept, (err, res) => {
    departmentList = res.map((departments) => ({
      name: departments.name,
      value: departments.id,
    }));
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'newRole',
          message: 'What is the title of the new role?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of this role?',
        },
        {
          type: 'list',
          name: 'department',
          message: 'Which department does this role belong to?',
          choices: departmentList,
        },
      ])
      .then((answers) => {
        const sqlRole = `INSERT INTO role SET title = ${answers.newRole}, department_id=${answers.department}, salary = ${answers.salary};`;
        db.query(sqlRole, (err, res) => {
          console.log(`Added ${answers.newRole} to the database`);
          Question();
        });
      });
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What is the name of your department?',
      },
    ])
    .then((answers) => {
      const sqlDept = `INSERT INTO department(name) VALUES('${answers.department}');`;
      db.query(sqlDept, (err, res) => {
        console.log(
          `Successfuly added ${answers.department} to our list of departments!`
        );
        Question();
      });
    });
}

function updateEmployee() {
  const sqlEmp = `SELECT * FROM employee`;
  db.query(sqlEmp, (err, res) => {
    employeeList = res.map((employee) => ({
      name: employee.first_name.concat(' ', employee.last_name),
      value: employee.id,
    }));
    //
    const sqlRole = `SELECT * FROM role`;
    db.query(sqlRole, (err, res) => {
      roleList = res.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      const sqlEmp = `SELECT * FROM employee WHERE manager_id IS NULL`;
      db.query(sqlEmp, (err, res) => {
        managerList = res.map((employee) => ({
          name: employee.first_name.concat(' ', employee.last_name),
          value: employee.id,
        }));
        
        // updating 
        return inquirer
          .prompt([
            {
              type: 'list',
              name: 'employee',
              message: 'Which employee would you like to make edits to?',
              choices: employeeList,
            },
            {
              type: 'list',
              name: 'role',
              message: 'What new role does the selected employee do now?',
              choices: roleList,
            },
            {
              type: 'list',
              name: 'manager',
              message: 'Who will the employee report to?',
              choices: managerList,
            },
          ])
          .then((answers) => {
            const employeeUpdated = `UPDATE employee SET manager_id=${answers.manager}, role_id=${answers.role} WHERE id = ${answers.employee};`;
            db.query(employeeUpdated, (err, res) => {
              if (err) throw err;
              console.log('Employee changes are complete!');
              Question();
            });
          });
      });
    });
  });
}

//Views

function viewEmployees() {
  const sqlEmp = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`;
  //Pass variable above into query
  db.query(sqlEmp, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res);
    Question();
  });
}

function viewRoles() {
  const sqlRole = `SELECT role.id, role.title AS role, role.salary, department.name AS department FROM role INNER JOIN department ON (department.id = role.department_id);`;
  db.query(sqlRole, (err, res) => {
    console.table(res);
    Question();
  });
}

function viewDepartments() {
  const sqlDept = `SELECT department.id, department.name AS Department FROM department;`;
  db.query(sqlDept, (err, res) => {
    console.table(res);
    Question();
  });
}
