# Task 8 — JSON Configuration Manager

A Node.js utility library for managing application configuration loaded from JSON files.  
No external runtime dependencies — only `jest` for testing.

---

## Features

| Feature | Description |
|---|---|
| **Load** | Read & parse a JSON config file from disk |
| **Nested get/set** | Dot-notation access to deeply nested keys |
| **Env interpolation** | Replace `${VAR}` placeholders with `process.env` values |
| **Schema validation** | Check types and required fields without external libraries |

---

## Folder Structure

```
task8/
├── config/
│   ├── configManager.js   ← main class
│   ├── interpolator.js    ← env-var interpolation
│   └── validator.js       ← schema validation
├── src/
│   ├── config.json        ← sample configuration
│   └── schema.json        ← sample schema
├── tests/
│   └── configManager.test.js
├── demo.js
└── package.json
```

---

## Quick Start

```bash
npm install
npm start    # run demo
npm test     # run test suite
```

---

## API

### `config.load(filePath)`

Load and parse a JSON file.  Environment variable placeholders are expanded immediately.

```javascript
const ConfigManager = require('./config/configManager');
const cfg = new ConfigManager();

cfg.load('./src/config.json');
```

Throws `Error` if the file is missing or contains invalid JSON.

---

### `config.get(path, [default])`

Retrieve a value by dot-notation path.  Returns `defaultValue` (or `undefined`) when the key does not exist.

```javascript
cfg.get('database.host');           // 'localhost'
cfg.get('database.port', 5432);     // 5432  (or default if missing)
cfg.get('does.not.exist', 'n/a');   // 'n/a'
```

---

### `config.set(path, value)`

Write a value at a dot-notation path.  Intermediate objects are created automatically.

```javascript
cfg.set('database.port', 3306);
cfg.set('cache.redis.host', '127.0.0.1'); // creates cache.redis
```

---

### `config.validate(schema)`

Validate the current config against a plain-object schema.  
Schema leaf values are type strings: `'string'`, `'number'`, `'boolean'`, `'object'`, `'array'`.

```javascript
const schema = {
  database: {
    host: 'string',
    port: 'number'
  }
};

const result = cfg.validate(schema);
// { valid: true,  errors: [] }
// { valid: false, errors: ['"database.port" should be number but got string'] }
```

---

## Environment Variable Interpolation

Placeholders in the form `${VAR_NAME}` are replaced with `process.env.VAR_NAME` when the file is loaded.  Multiple placeholders per string are supported.  Unresolved placeholders are left unchanged.

```json
{
  "database": {
    "host": "${DB_HOST}",
    "name": "myapp_${NODE_ENV}"
  }
}
```

```bash
DB_HOST=pg.example.com NODE_ENV=production node demo.js
```

Result: `database.host → "pg.example.com"`, `database.name → "myapp_production"`.

---

## Running Tests

```bash
npm test
```

28 test cases covering: loading (valid / invalid / missing), `get()`, `set()`, interpolation, and schema validation.
