### Task 10: Logger with Levels

**PRD:**
> Create a logging library with multiple log levels, output formatting, and transport options (console, file).

**Requirements:**
- Log levels: DEBUG, INFO, WARN, ERROR
- Configurable minimum level
- Timestamps and metadata
- Pretty print vs JSON format
- File rotation (optional)

**API:**
```javascript
logger.setLevel('INFO');
logger.info('User logged in', { userId: 123 });
logger.error('Database error', { error: err });
logger.debug('Query', { sql: 'SELECT *' });
```

**Deliverables:**
- [x] Logger class
- [x] Multiple transports
- [x] Format options
- [x] Test suite

## Installation

Ensure you are in the root workspace folder, then run:

```bash
npm install
```

## Usage

Run the logging demo:

```bash
npm run start:t10
```

Run the logger test suite:

```bash
npm run test:t10
```

Example Usage:

```javascript
const Logger = require('./logger');

const logger = new Logger({
    level: 'INFO',
    format: 'pretty'
});

logger.info('User logged in', { userId: 123 });
logger.error('Database connection failed', { code: 500 });
```

## API Reference

| Method / Option | Description |
|---|---|
| `new Logger(options)` | Instantiates a new logger. Options include: `level` (default `"DEBUG"`), `format` (default `"pretty"`), and `transports`. |
| `setLevel(level)` | Changes the minimum threshold logging level. Throws error if the level is invalid. |
| `debug(msg, meta)` | Log debug severity message. |
| `info(msg, meta)` | Log info severity message. |
| `warn(msg, meta)` | Log warn severity message. |
| `error(msg, meta)` | Log error severity message. |

## Design Details

* **Multiple Transports**: Messages can be piped simultaneously to the console and to a local text log file (located at `logs/app.log`).
* **Formatters**: Supports raw JSON string formatting (`json`) and human-readable metadata logging (`pretty`).
* **Log Levels Thresholds**: Restricts console and file output to only messages whose severity is greater than or equal to the configured active level.
