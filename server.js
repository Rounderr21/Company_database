const inquirer =require('inquirer');

//use cfonts to put the ascii on the top of the database page//
const cfonts = require('cfonts');
const mysql = require('mysql2');

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


    // necessary libraries (e.g., inquirer, mysql)

// Connect to the database ie company_db

// Main application loop
function main() {
    // Display menu options using inquirer
    // Based on user choice, call the appropriate functions to handle database operations
    // Display results or error messages
    // Repeat the loop until the user chooses to exit
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
        console.log(res);
    })
  }
  
  // Implement functions to handle database operations (view, add, update)
  
  
  // Start the application by calling the main function
  main();
