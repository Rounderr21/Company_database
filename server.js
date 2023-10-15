const inquirer =require('inquirer');

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