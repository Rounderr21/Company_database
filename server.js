// Imported packages
const inquirer = require("inquirer");
const cfonts = require("cfonts");
const mysql = require("mysql2");

//importing cfonts to node.js to create a cool logo for the company
cfonts.say("Company|Database!", {
  font: "block",
  align: "left",
  colors: ["system"],
  background: "transparent",
  letterSpacing: 1,
  space: true,
  maxLength: "0",
  gradient: false,
  independentGradient: false,
  transitionGradient: false,
  env: "node",
});

//connecting to the database of the company
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bootcamp",
  database: "company_db",
});

// Test connection to database and makes sure we are connected or not
connection.connect((err) => {
  if (err) {
    console.error("Database connection error: " + err.stack);
    return;
  }
  console.log("Connected to database");
});

//function to generate a table for the user to view in termainal
function generateTable(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return "No data to display.";
  }

  // Get the column names from the first object in the array
  const columns = Object.keys(data[0]);

  // Create the table header
  const header = columns.map((column) => column.padEnd(20)).join(" | ");

  // Create the table rows
  const rows = data.map((row) =>
    columns.map((column) => String(row[column]).padEnd(20)).join(" | ")
  );

  // Combine the header and rows
  return `${header}\n${"-".repeat(header.length)}\n${rows.join("\n")}`;
}

// Main application loop
function main() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Menu",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employees",
          "Update Employee Role",
          "View All Roles",
          "Add A Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((res) => {
      handleUserChoice(res);
    });
}

//function to handle what choice the user has asked for
function handleUserChoice(choice) {
  const userChoice = choice.Menu;
  switch (userChoice) {
    case "View All Employees":
      viewAllEmployees();
      break;

    case "Add Employees":
      addEmployee();
      break;

    case "Update Employee Role":
      updateRole();
      break;

    case "View All Roles":
      viewAllRoles();
      break;

    case "Add A Role":
      addRole();
      break;

    case "View All Departments":
      viewAllDepartments();
      break;

    case "Add Department":
      addDepartment();
      break;

    case "Quit":
      exitConsole();

    default:
      console.log("Invalid choice. Please select a valid option.");
      main();
  }
}

//displaying all employees within the company
function viewAllEmployees() {
  const query = "SELECT * FROM employees";
  connection.query(query, function (err, result) {
    if (err) throw err;
    const table = generateTable(result);
    console.log(`\n${table}\n`);
    main();
  });
}

//adding a new employee to the company database
function addEmployee() {
  connection
    .promise()
    .query("SELECT title FROM roles")
    .then(([roles]) => {
      const roleChoices = roles.map((role) => ({
        name: role.title,
      }));

      return connection
        .promise()
        .query("SELECT first_name, last_name FROM employees")
        .then(([employees]) => {
          const employeeNames = employees.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
          }));

          return connection
            .promise()
            .query("SELECT department_name FROM departments")
            .then(([departments]) => {
              const departmentNames = departments.map((department) => ({
                name: department.department_name,
              }));

              inquirer
                .prompt([
                  {
                    type: "input",
                    name: "firstname",
                    message: "What is the employee's first name?",
                  },
                  {
                    type: "input",
                    name: "lastname",
                    message: "What is the employee's last name?",
                  },
                  {
                    type: "list",
                    name: "title",
                    message: "What is the employee's role?",
                    choices: roleChoices,
                  },
                  {
                    type: "list",
                    name: "department",
                    message: "What is the employee's department?",
                    choices: departmentNames,
                  },
                  {
                    type: "input",
                    name: "salary",
                    message: "What is the employee's salary?",
                    validate: function (value) {
                      const parsedSalary = parseInt(value, 10);
                      if (isNaN(parsedSalary) || parsedSalary < 0) {
                        return "Please enter a valid positive integer for salary.";
                      }
                      return true;
                    },
                  },
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: [...employeeNames, "null"],
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

                  connection.query(
                    query,
                    [first_name, last_name, title, department, salary, manager],
                    (err, res) => {
                      if (err) throw err;
                      console.log(
                        `Employee ${first_name} ${last_name} added successfully!`
                      );
                      main();
                    }
                  );
                });
            });
        });
    });
}

//updating employee role within the company
function updateRole() {
  connection
    .promise()
    .query("SELECT title FROM roles")
    .then(([roles]) => {
      const roleChoices = roles.map((role) => ({
        name: role.title,
      }));

      connection
        .promise()
        .query("SELECT first_name, last_name FROM employees")
        .then(([employees]) => {
          const employeeNames = employees.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Which employee's role do you want to update?",
                choices: employeeNames,
              },
              {
                type: "list",
                name: "role",
                message:
                  "Which role do you want to assign the selected employee?",
                choices: roleChoices,
              },
            ])
            .then((res) => {
              const title = res.role;
              const first_name = res.employee.split(" ")[0];
              const last_name = res.employee.split(" ")[1];

              // Updates the employee's role using an UPDATE query
              const query =
                "UPDATE employees SET title = ? WHERE first_name = ? AND last_name = ?";

              connection.query(
                query,
                [title, first_name, last_name],
                (err, res) => {
                  if (err) throw err;
                  console.log(`Updated employee's role within the company.`);
                  main();
                }
              );
            });
        });
    });
}

//Displaying all roles that are within a company
function viewAllRoles() {
  const query = "SELECT * FROM roles";
  connection.query(query, function (err, result) {
    if (err) throw err;
    const table = generateTable(result);
    console.log(`\n${table}\n`);
    main();
  });
}

//adding new role to the company database
function addRole() {
  connection
    .promise()
    .query("SELECT department_name FROM departments")
    .then(([departments]) => {
      const departmentChoices = departments.map(
        (department) => department.department_name
      );

      inquirer
        .prompt([
          {
            type: "input",
            name: "role",
            message: "What is the name of the role?",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?",
          },
          {
            type: "list",
            name: "department",
            message: "Which department does the role belong to?",
            choices: departmentChoices,
          },
        ])
        .then((res) => {
          const query = `INSERT INTO roles (title, salary, department) VALUES (?, ?, ?)`;
          connection.query(
            query,
            [res.role, res.salary, res.department],
            (err, result) => {
              if (err) throw err;
              console.log(`Added ${res.role} to the database.`);
              main();
            }
          );
        });
    });
}

//displaying all departments in the database
function viewAllDepartments() {
  const query = "SELECT * FROM departments";
  connection.query(query, function (err, result) {
    if (err) throw err;
    const table = generateTable(result);
    console.log(`\n${table}\n`);
    main();
  });
}

//adding a new department to database
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((res) => {
      // Add the department information to the database
      const query = `INSERT INTO departments (department_name) VALUES (?)`;
      connection.query(query, [res.department], (err, result) => {
        if (err) throw err;
        console.log(`Added ${res.department} to the database.`);
        main();
      });
    });
}

//exiting the console database
function exitConsole() {
  process.exit(0);
}

// Start the application by calling the main function
main();
