# Task 10: Logger with Levels

## System Design
The Logger system is designed to provide configurable, level-based logging. It allows filtering of log messages based on a predefined minimum threshold, ensuring that only messages of sufficient importance are captured or displayed.

## Workflow
1. **Initialization**: The Logger is instantiated with a minimum log level (e.g., INFO).
2. **Logging**: The log(level, message) method is invoked.
3. **Filtering**: The Logger compares the message level with the configured minimum level.
4. **Formatting & Output**: If the message passes the threshold, it is formatted with a timestamp and the log level, then written to the destination (console).

## File Attribution
- **logger.py**: Implements the Logger class, defines log level constants (DEBUG, INFO, WARNING, ERROR), and handles formatting and threshold filtering logic.
- **	est_logger.py**: Contains comprehensive unit tests to validate the filtering logic and ensure correct message formatting.
