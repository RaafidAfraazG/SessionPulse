/**
 * @file app.js
 * @description Express application factory.
 *
 * Separates application setup from server startup (index.js).
 * This pattern makes the app easy to import in integration tests
 * without actually binding to a port.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// ── Route Modules ─────────────────────────────────────────────────────────────
const eventsRouter = require('./routes/events');
const sessionsRouter = require('./routes/sessions');
const heatmapRouter = require('./routes/heatmap');
const resetRouter = require('./routes/reset');

// ── App Initialisation ────────────────────────────────────────────────────────
const app = express();

// ── Security Middleware ───────────────────────────────────────────────────────
/**
 * Helmet sets a suite of security-related HTTP response headers:
 * Content-Security-Policy, X-XSS-Protection, X-Frame-Options, etc.
 */
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
/**
 * Allow the tracker script (running on any page) to POST events.
 * In production, restrict CORS_ORIGIN to your known frontend domain(s).
 */
const corsOptions = {
  // CLIENT_URL takes priority (Render convention), falls back to CORS_ORIGIN.
  origin: process.env.CLIENT_URL || process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // Allow pre-flight requests for all routes.
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// Handle preflight OPTIONS requests for all routes.
app.options('*', cors(corsOptions));

// ── Request Logging ───────────────────────────────────────────────────────────
app.use(requestLogger());

// ── Body Parsers ──────────────────────────────────────────────────────────────
// Parse JSON payloads (tracker sends application/json).
app.use(express.json({ limit: '10kb' })); // limit prevents abuse
// Parse URL-encoded bodies (for any form submissions).
app.use(express.urlencoded({ extended: false }));

// ── Health Check ──────────────────────────────────────────────────────────────
/**
 * Simple health-check endpoint — useful for load balancers / uptime monitors.
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/events', eventsRouter);
app.use('/api/events', resetRouter);   // DELETE /api/events/reset
app.use('/api/sessions', sessionsRouter);
app.use('/api/heatmap', heatmapRouter);

// ── 404 Handler ───────────────────────────────────────────────────────────────
// Must come AFTER all registered routes.
app.use(notFound);

// ── Global Error Handler ──────────────────────────────────────────────────────
// Must come LAST — 4-argument signature signals Express this is an error handler.
app.use(errorHandler);

module.exports = app;
