const inquirer =require('inquirer');
const mysql = require('')
inquirer
    .prompt([
        {
            type: 'list',
            name: 'food',
            message: 'what would you like to eat?',
            choices:['pizza', 'waffles', 'burger'],
        },
    ]).then((res) =>
    {
        console.log(res);
    })

    // necessary libraries (e.g., inquirer, mysql)

// Connect to the database ie company_db

// Main application loop
function main() {
    // Display menu options using inquirer
    // Based on user choice, call the appropriate functions to handle database operations
    // Display results or error messages
    // Repeat the loop until the user chooses to exit
  }
  
  // Implement functions to handle database operations (view, add, update)
  
  // Start the application by calling the main function
  