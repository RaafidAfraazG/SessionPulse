/**
 * @file errorHandler.js
 * @description Centralised Express error-handling middleware.
 *
 * Catches errors forwarded via next(err) from any route or middleware.
 * Returns a consistent JSON error envelope so clients always know
 * what shape to expect.
 *
 * Usage: app.use(errorHandler) — must be registered LAST in app.js.
 */

/**
 * Global error handler middleware.
 *
 * @param {Error}              err  - The error object
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next  - Required by Express to recognise 4-arg signature
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log the full stack in development for easier debugging.
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Error:', err.stack);
  } else {
    console.error(`🔥 Error [${err.name}]: ${err.message}`);
  }

  // ── Mongoose Validation Error ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: messages,
    });
  }

  // ── Mongoose Cast Error (e.g. invalid ObjectId) ──────────────────────────
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Invalid value for field: ${err.path}`,
    });
  }

  // ── MongoDB Duplicate Key ─────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `Duplicate value for field: ${field}`,
    });
  }

  // ── Generic / Unhandled Errors ────────────────────────────────────────────
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
