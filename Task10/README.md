# Logger with Levels

## Description

A lightweight logging library for Node.js supporting multiple log levels, configurable output formats, and console/file transports.

## Features

* DEBUG, INFO, WARN, and ERROR log levels
* Configurable minimum log level
* Automatic timestamps
* Metadata support
* Pretty and JSON output formats
* Console and file transports

## Installation

```bash
git clone <repository-url>
cd task10
npm install
```

## Usage

Run the demo:

```bash
npm start
```

Run the tests:

```bash
npm test
```

Example:

```javascript
const Logger = require("./logger");

const logger = new Logger({
    level: "INFO",
    format: "pretty"
});

logger.info("User logged in", { userId: 123 });
logger.warn("Low disk space");
logger.error("Database error");
```

## API

| Method                     | Description                |
| -------------------------- | -------------------------- |
| `setLevel(level)`          | Set the minimum log level. |
| `debug(message, metadata)` | Log a DEBUG message.       |
| `info(message, metadata)`  | Log an INFO message.       |
| `warn(message, metadata)`  | Log a WARN message.        |
| `error(message, metadata)` | Log an ERROR message.      |

## Design

* Logger handles log filtering and coordination.
* Formatter supports Pretty and JSON output.
* Console transport prints logs to the terminal.
* File transport appends logs to `logs/app.log`.

## Technologies

* Node.js
* JavaScript (ES6)
* Jest

## License

Created as part of a technical assessment for educational purposes.
