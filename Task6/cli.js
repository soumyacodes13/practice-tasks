const inquirer = require('inquirer');
const { validate } = require('./validator');

const schema = {
    name: { type: 'string', required: true, min: 2, max: 50 },
    email: { type: 'email', required: true },
    age: { type: 'number', required: true, min: 18, max: 120 },
    website: { type: 'url', required: false },
    dob: { type: 'date', required: true }
};

async function run() {
    console.log('📋 Data Validator CLI');
    console.log('---------------------');
    console.log('Enter details to validate against the User Profile schema.\n');

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Name (min 2 chars):'
        },
        {
            type: 'input',
            name: 'email',
            message: 'Email:'
        },
        {
            type: 'input',
            name: 'age',
            message: 'Age (min 18):',
            validate: (input) => {
                if (input === '' || isNaN(input)) return 'Please enter a number';
                return true;
            },
            filter: (input) => input === '' ? '' : Number(input)
        },
        {
            type: 'input',
            name: 'website',
            message: 'Website (optional, e.g. https://site.com):'
        },
        {
            type: 'input',
            name: 'dob',
            message: 'Date of Birth (YYYY-MM-DD):'
        }
    ]);

    const result = validate(answers, schema);

    if (result.valid) {
        console.log('\n✅ Validation Passed! Data is valid.');
        console.log(JSON.stringify(answers, null, 2));
    } else {
        console.log('\n❌ Validation Failed:');
        result.errors.forEach(err => console.log(`  - ${err}`));
    }
}

run().catch(err => {
    console.error('An error occurred:', err);
});
