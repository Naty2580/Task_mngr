import log from "loglevel";

// Set the default logging level (change this for production)
log.setLevel("info"); // Options: trace, debug, info, warn, error, silent

// Create a logger object to use in the app
const logger = {
  trace: (...args) => log.trace(...args),
  debug: (...args) => log.debug(...args),
  info: (...args) => log.info(...args),
  warn: (...args) => log.warn(...args),
  error: (...args) => log.error(...args),
};

// Export the logger for use in other parts of the app
export default logger;
