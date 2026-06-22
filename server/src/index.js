/**
 * @file index.js
 * @description Server entry point.
 *
 * Loads environment variables, connects to MongoDB, then starts the
 * HTTP server. Registers handlers for unhandled rejections and
 * uncaught exceptions so the process exits cleanly with a useful log.
 */

// Load .env variables FIRST — before any other module reads process.env.
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const startServer = async () => {
  // 1. Connect to MongoDB.
  await connectDB();

  // 2. Start listening.
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║          SessionPulse API Server         ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Environment : ${NODE_ENV.padEnd(25)}║`);
    console.log(`║  Port        : ${String(PORT).padEnd(25)}║`);
    console.log(`║  Base URL    : http://localhost:${String(PORT).padEnd(11)}║`);
    console.log('╠══════════════════════════════════════════╣');
    console.log('║  Endpoints:                              ║');
    console.log('║   POST  /api/events                      ║');
    console.log('║   GET   /api/sessions                    ║');
    console.log('║   GET   /api/sessions/:sessionId         ║');
    console.log('║   GET   /api/heatmap?page=<url>          ║');
    console.log('║   GET   /health                          ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
  });

  // ── Graceful Shutdown ───────────────────────────────────────────────────
  const gracefulShutdown = (signal) => {
    console.log(`\n🛑  Received ${signal}. Shutting down gracefully…`);
    server.close(() => {
      console.log('✅  HTTP server closed.');
      process.exit(0);
    });

    // Force shutdown after 10 seconds if connections don't drain.
    setTimeout(() => {
      console.error('⏱   Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

// ── Unhandled Rejection / Exception Guards ────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥  Unhandled Promise Rejection:', reason);
  console.error('    At:', promise);
  // In production, exit and let the process manager restart the service.
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('🔥  Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// ── Start ─────────────────────────────────────────────────────────────────────
startServer();
