const inquirer = require('inquirer');
const PasswordChecker = require('./checker');

async function run() {
    console.log('🛡️  Password Strength Checker');
    console.log('----------------------------');

    const answers = await inquirer.prompt([
        {
            type: 'password',
            name: 'password',
            message: 'Enter your password to check:',
            mask: '*'
        }
    ]);

    const result = PasswordChecker.checkStrength(answers.password);

    console.log(`\nScore: ${result.score}/7`);
    console.log(`Rating: ${getRatingColor(result.rating)} ${result.rating}`);

    if (result.feedback.length > 0) {
        console.log('\nFeedback:');
        result.feedback.forEach(f => console.log(`- ${f}`));
    } else {
        console.log('\n✅ Great password! No suggestions.');
    }
}

function getRatingColor(rating) {
    switch (rating) {
        case 'Weak': return '🔴';
        case 'Fair': return '🟡';
        case 'Good': return '🟢';
        case 'Strong': return '💎';
        default: return '';
    }
}

run().catch(err => {
    console.error('Error:', err);
});
