const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "logs");
const logFile = path.join(logDirectory, "app.log");

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

function consoleTransport(message) {
    console.log(message);
}

function fileTransport(message) {
    fs.appendFileSync(logFile, message + "\n");
}

module.exports = {
    consoleTransport,
    fileTransport
};