const { formatPretty, formatJSON } = require("./formatter");
const { consoleTransport, fileTransport } = require("./transports");

const LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

class Logger {
    constructor(options = {}) {
        this.level = options.level || "DEBUG";
        this.format = options.format || "pretty";
        this.transports = options.transports || [
            consoleTransport,
            fileTransport
        ];
    }

    setLevel(level) {
        if (!LEVELS.hasOwnProperty(level)) {
            throw new Error(`Invalid log level: ${level}`);
        }

        this.level = level;
    }

    debug(message, metadata = {}) {
        this.log("DEBUG", message, metadata);
    }

    info(message, metadata = {}) {
        this.log("INFO", message, metadata);
    }

    warn(message, metadata = {}) {
        this.log("WARN", message, metadata);
    }

    error(message, metadata = {}) {
        this.log("ERROR", message, metadata);
    }

    log(level, message, metadata) {
        if (LEVELS[level] < LEVELS[this.level]) {
            return;
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            metadata
        };

        const formattedMessage =
            this.format === "json"
                ? formatJSON(logEntry)
                : formatPretty(logEntry);

        for (const transport of this.transports) {
            transport(formattedMessage);
        }
    }
}

module.exports = Logger;