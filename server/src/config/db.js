/**
 * @file db.js
 * @description MongoDB connection setup using Mongoose.
 *
 * Connects to the database specified in MONGO_URI env var.
 * Emits lifecycle events for clean startup/shutdown logging.
 */

const mongoose = require('mongoose');

/**
 * Establish a connection to MongoDB.
 * Exits the process if the initial connection fails.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  // Support MONGO_URI (our convention) and MONGODB_URI (Render/Atlas convention).
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌  No MongoDB URI found. Set MONGO_URI or MONGODB_URI in .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 7+ no longer requires these flags, but they are
      // included for clarity and future compatibility.
      autoIndex: true, // build indexes on startup
    });

    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB connection failed: ${error.message}`);
    // Exit the process — the server should not run without a database.
    process.exit(1);
  }
};

// ── Connection lifecycle events ───────────────────────────────────────────────

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️   MongoDB disconnected. Attempting to reconnect…');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄  MongoDB reconnected.');
});

module.exports = connectDB;
