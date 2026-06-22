/**
 * @file notFound.js
 * @description 404 handler middleware for unmatched routes.
 *
 * Must be registered AFTER all routes but BEFORE the error handler.
 * Creates a proper Error object and forwards it to the global errorHandler
 * so all error responses share the same JSON envelope shape.
 */

/**
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = notFound;
