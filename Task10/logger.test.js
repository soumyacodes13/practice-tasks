const Logger = require("./logger");
const fs = require("fs");

jest.mock("fs");

describe("Logger", () => {
    let logger;

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(console, "log").mockImplementation(() => {});

        logger = new Logger({
            level: "DEBUG",
            format: "pretty"
        });
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    test("should initialize with default values", () => {
        expect(logger.level).toBe("DEBUG");
        expect(logger.format).toBe("pretty");
    });

    test("should update log level", () => {
        logger.setLevel("WARN");

        expect(logger.level).toBe("WARN");
    });

    test("should throw for invalid log level", () => {
        expect(() => {
            logger.setLevel("INVALID");
        }).toThrow();
    });

    test("should ignore logs below minimum level", () => {
        logger.setLevel("INFO");

        logger.debug("Hidden message");

        expect(console.log).not.toHaveBeenCalled();
        expect(fs.appendFileSync).not.toHaveBeenCalled();
    });

    test("should log messages at or above minimum level", () => {
        logger.setLevel("INFO");

        logger.error("Database error");

        expect(console.log).toHaveBeenCalledTimes(1);
        expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
    });

    test("should format logs as pretty text", () => {
        logger.info("User logged in", {
            userId: 123
        });

        const output = console.log.mock.calls[0][0];

        expect(output).toContain("INFO");
        expect(output).toContain("User logged in");
        expect(output).toContain("userId");
    });

    test("should format logs as JSON", () => {
        logger = new Logger({
            level: "DEBUG",
            format: "json"
        });

        logger.info("User logged in", {
            userId: 123
        });

        const output = console.log.mock.calls[0][0];
        const log = JSON.parse(output);

        expect(log.level).toBe("INFO");
        expect(log.message).toBe("User logged in");
        expect(log.metadata.userId).toBe(123);
    });

    test("should write logs to file", () => {
        logger.warn("Low disk space");

        expect(fs.appendFileSync).toHaveBeenCalledTimes(1);
    });
});