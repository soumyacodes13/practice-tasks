# Data Validator

A Node.js library for validating JavaScript objects against customizable schemas. Supports validation for strings, numbers, emails, URLs, dates, and required fields.

## Requirements

- Node.js 16 or later
- npm

Check your installation:

```bash
node -v
npm -v
```

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <repository-folder>
npm install
```

## Project Structure

```text
.
├── validator.js
├── cli.js
├── validator.test.js
├── package.json
└── README.md
```

## Running the CLI

```bash
npm start
```

or

```bash
node cli.js
```

## Running Tests

```bash
npm test
```

## Usage

```javascript
const { validate } = require('./validator');

const schema = {
    name: { type: 'string', required: true, min: 2, max: 50 },
    email: { type: 'email', required: true },
    age: { type: 'number', required: true, min: 18, max: 120 },
    website: { type: 'url' },
    dob: { type: 'date', required: true }
};

const data = {
    name: "John",
    email: "john@example.com",
    age: 25,
    website: "https://example.com",
    dob: "2000-01-01"
};

const result = validate(data, schema);

console.log(result);
```

## Example Output

```javascript
{
  valid: true,
  errors: []
}
```

or

```javascript
{
  valid: false,
  errors: [
    "email is not a valid email",
    "age must be at least 18"
  ]
}
```

## License

MIT