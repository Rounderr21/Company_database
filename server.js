const inquirer = require('inquirer');
const cfonts = require('cfonts');
const mysql = require('mysql2');

//importing cfonts to node.js
cfonts.say('Company|Database!', {
	font: 'block',              
	align: 'left',             
	colors: ['system'],         
	background: 'transparent',  
	letterSpacing: 1,           
	space: true,               
	maxLength: '0',             
	gradient: false,            
	independentGradient: false,
	transitionGradient: false, 
	env: 'node'                
});

//connecting to the database of the company
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bootcamp',
    database: 'company_db',
});

// Test connection to database and makes sure we are connected or not
connection.connect((err) => {
	if (err) {
		console.error('Database connection error: ' + err.stack);
		return;
	}
	console.log('Connected to database');
});

  function generateTable(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return 'No data to display.';
    }
  
    // Get the column names from the first object in the array
    const columns = Object.keys(data[0]);
  
    // Create the table header
    const header = columns.map(column => column.padEnd(20)).join(' | ');
  
    // Create the table rows
    const rows = data.map(row => columns.map(column => String(row[column]).padEnd(20)).join(' | '));
  
    // Combine the header and rows
    return `${header}\n${'-'.repeat(header.length)}\n${rows.join('\n')}`;
  }

// Main application loop //FINSHED
function main() {

    inquirer
    .prompt([
        {
            type: 'list',
            name: 'Menu',
            message: 'What would you like to do?',
            choices:['View All Employees', 'Add Employees', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'],
        },
    ]).then((res) =>
    {
        //console.log(res);
        handleUserChoice(res);
    })
  }

  //function to handle what choice the user has asked for //FINSIHED
  function handleUserChoice(choice) {
    const userChoice = choice.Menu;
    //console.log('User choice:', userChoice);
    switch (userChoice) {
      case 'View All Employees':
        viewAllEmployees();
        break;

      case 'Add Employees':
        addEmployee();
        break;

      case 'Update Employee Role':
        updateRole();
        break;

      case 'View All Roles':
        viewAllRoles();
        break;

      case 'Add a role':
        addRole();
        break;

      case 'View All Departments':
        viewAllDepartments();
        break;

      case 'Add Department':
        addDepartment();
        break;

      case 'Quit':
        exitConsole();

      default:
        console.log('Invalid choice. Please select a valid option.');
        main();
    }
  }

  //displaying all employees within the company //FINSHED
  function viewAllEmployees(){
    const query = "SELECT * FROM employees";
    connection.query(query, function (err, result) {
      if (err) throw err;
      const table = generateTable(result);
      console.log(`\n${table}\n`);
      main();
    });
  }

  //adding a new employee to the company database //FINISHED
function addEmployee() {
  connection.promise()
      .query('SELECT title FROM roles')
      .then(([roles]) => {
          const roleChoices = roles.map((role) => ({
              name: role.title,
          }));

          return connection.promise()
              .query('SELECT first_name, last_name FROM employees')
              .then(([employees]) => {
                  const employeeNames = employees.map((employee) => ({
                      name: employee.first_name + " " + employee.last_name,
                  }));

                  return connection.promise()
                      .query('SELECT department_name FROM departments')
                      .then(([departments]) => {
                          const departmentNames = departments.map((department) => ({
                              name: department.department_name,
                          }));

                          inquirer
                              .prompt([
                                  {
                                      type: 'input',
                                      name: 'firstname',
                                      message: 'What is the employee\'s first name?'
                                  },
                                  {
                                      type: 'input',
                                      name: 'lastname',
                                      message: 'What is the employee\'s last name?'
                                  },
                                  {
                                      type: 'list',
                                      name: 'title',
                                      message: 'What is the employee\'s role?',
                                      choices: roleChoices,
                                  },
                                  {
                                      type: 'list',
                                      name: 'department',
                                      message: 'What is the employee\'s department?',
                                      choices: departmentNames,
                                  },
                                  {
                                    type: 'input',
                                    name: 'salary',
                                    message: 'What is the employee\'s salary?',
                                    validate: function (value) {
                                        const parsedSalary = parseInt(value, 10);
                                        if (isNaN(parsedSalary) || parsedSalary < 0) {
                                            return 'Please enter a valid positive integer for salary.';
                                        }
                                        return true;
                                    }
                                },
                                  {
                                      type: 'list',
                                      name: 'manager',
                                      message: "Who is the employee's manager?",
                                      choices: [...employeeNames, 'null'],
                                  },
                              ])
                              .then((res) => {
                                  const first_name = res.firstname;
                                  const last_name = res.lastname;
                                  const title = res.title;
                                  const department = res.department;
                                  const salary = parseInt(res.salary, 10);
                                  const manager = res.manager;

                                  // Adjust the INSERT statement to match the number of columns and values
                                  const query = `INSERT INTO employees (first_name, last_name, title, department, salary, manager) VALUES (?, ?, ?, ?, ?, ?)`;

                                  connection.query(query, [first_name, last_name, title, department, salary, manager], (err, res) => {
                                      if (err) throw err;
                                      console.log(`Employee ${first_name} ${last_name} added successfully!`);
                                      main();
                                  });
                              });
                      });
              });
      });
}


//updating employee role within the company //MUST STILL FINISH
  function updateRole(){
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'name',
            message: "Which employee's role do you want to update?",
            choices: [fetchEmployeeNames, 'none'] //need to fix this line of code
        },
        {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to assign the selected employee?',
            choices: []//roles should be in here from the database//
        },
    ]).then((res) =>
    {
        console.log("Updated employee's role.");
        console.log(res);
    })
    main();
  }

  //Displaying all roles that are within a company //FINSIHED
  function viewAllRoles(){
    const query = "SELECT * FROM roles";
    connection.query(query, function (err, result) {
      if (err) throw err;
      const table = generateTable(result);
      console.log(`\n${table}\n`);
      main();
    });
  }

  //adding new role to the company database //MUST STILL FINISH
  function addRole(){
    inquirer
    .prompt([
        {
            type: 'type',
            name: 'role',
            message: 'What is the name of the role?'
        },
        {
            type: 'type',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to?',
            choices: ['Service', 'Sales', 'Rental'],
        },
    ]).then((res) =>
    {
        //tells you the name of what was added to the database
        console.log(`Added ${res.role} to the database.`)
    })

    //MUST ADD THE INFORMATION ABOVE TO THE DATABASE FORE REAL THOU DONT FORGET THIS PART
        main();
  }
  
  //displaying all departments in the database //FINSIHED
  function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    connection.query(query, function (err, result) {
      if (err) throw err;
      const table = generateTable(result);
      console.log(`\n${table}\n`);
      main();
    });
  }
  
  //adding a new department to database //MUST STILL FINISH
  function addDepartment(){
    inquirer
    .prompt([
        {
            type: 'type',
            name: 'department',
            message: 'What is the name of the department?'
        },
    ]).then((res) =>
    {
        //tells you the name of what was added to the database
        console.log(`Added ${res.department} to the database.`)
    })

    //MUST ADD THE DEPARTMENT TO THE DATABASE FORE REAL THOU DONT FORGET THIS PART
        main();
  }

  //exiting the console database //FINISHED
  function exitConsole(){
    process.exit(0);
  }

  // Start the application by calling the main function
  main();
