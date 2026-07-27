function formatPretty(logEntry) {
    const { timestamp, level, message, metadata } = logEntry;

    return `[${timestamp}] ${level}: ${message}\nMetadata: ${JSON.stringify(metadata)}`;
}

function formatJSON(logEntry) {
    return JSON.stringify(logEntry);
}

module.exports = {
    formatPretty,
    formatJSON
};