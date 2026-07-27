const Logger = require("./logger");

// Pretty format
const logger = new Logger({
    level: "INFO",
    format: "pretty"
});

logger.debug("This debug message will not be shown");

logger.info("User logged in", {
    userId: 123
});

logger.warn("Low disk space", {
    freeSpace: "500 MB"
});

logger.error("Database connection failed", {
    code: 500
});

// JSON format
const jsonLogger = new Logger({
    level: "DEBUG",
    format: "json"
});

jsonLogger.debug("Executing query", {
    sql: "SELECT * FROM users"
});