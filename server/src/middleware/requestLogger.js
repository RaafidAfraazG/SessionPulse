/**
 * @file requestLogger.js
 * @description Morgan HTTP request logger configuration.
 *
 * Uses the 'dev' format in development (concise, colorised) and
 * the 'combined' Apache-style format in production for log aggregation.
 */

const morgan = require('morgan');

/**
 * Returns a configured Morgan middleware instance based on NODE_ENV.
 *
 * @returns {import('morgan').Morgan}
 */
const requestLogger = () => {
  const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  return morgan(format);
};

module.exports = requestLogger;
