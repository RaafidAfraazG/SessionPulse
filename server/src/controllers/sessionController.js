/**
 * @file sessionController.js
 * @description Controllers for session-related API endpoints.
 *
 * Endpoints:
 *  GET /api/sessions            — list all sessions with summary stats
 *  GET /api/sessions/:sessionId — events for a specific session
 */

const Event = require('../models/Event');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/sessions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return a summary of all unique sessions.
 *
 * Uses a MongoDB aggregation pipeline to group events by session_id and
 * compute:
 *  - total_events  : total number of events in the session
 *  - last_activity : timestamp of the most recent event
 *
 * Sessions are sorted by most recent activity (descending) so the latest
 * sessions appear first.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const getSessions = async (req, res, next) => {
  try {
    const sessions = await Event.aggregate([
      // ── Stage 1: Group by session_id ──────────────────────────────────
      {
        $group: {
          _id: '$session_id',
          total_events: { $sum: 1 },
          last_activity: { $max: '$timestamp' },
          // Capture the earliest event for potential future use.
          first_activity: { $min: '$timestamp' },
        },
      },

      // ── Stage 2: Rename _id → session_id for a clean response ─────────
      {
        $project: {
          _id: 0,
          session_id: '$_id',
          total_events: 1,
          last_activity: 1,
          first_activity: 1,
        },
      },

      // ── Stage 3: Sort by most recent activity first ───────────────────
      {
        $sort: { last_activity: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/sessions/:sessionId
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return all events for a specific session, ordered by timestamp ascending.
 *
 * @param {import('express').Request}      req  - req.params.sessionId
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const getSessionById = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    // Decode the session ID in case it was URL-encoded.
    const decodedSessionId = decodeURIComponent(sessionId);

    const events = await Event.find({ session_id: decodedSessionId })
      .sort({ timestamp: 1 }) // chronological order
      .select('-__v') // exclude Mongoose internals
      .lean(); // plain JS objects — faster reads, no Mongoose overhead

    if (events.length === 0) {
      // Return 404 if no events exist for this session rather than an empty 200,
      // so clients can distinguish "session not found" from "session has no events".
      const error = new Error(`No events found for session: ${decodedSessionId}`);
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      session_id: decodedSessionId,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSessions, getSessionById };
