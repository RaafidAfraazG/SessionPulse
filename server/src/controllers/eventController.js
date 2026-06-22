/**
 * @file eventController.js
 * @description Controller for POST /api/events.
 *
 * Handles ingestion of tracking events sent by the tracking script.
 * Validates the payload, persists to MongoDB, and returns the saved document.
 */

const Event = require('../models/Event');

/**
 * POST /api/events
 *
 * Store a single tracking event.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const createEvent = async (req, res, next) => {
  try {
    const { session_id, event_type, page_url, timestamp, x, y } = req.body;

    // ── Basic presence validation ─────────────────────────────────────────
    // Mongoose validation handles type + enum checks, but we surface a
    // clearer message for the most common missing-field case.
    if (!session_id || !event_type || !page_url || !timestamp) {
      const error = new Error(
        'Missing required fields: session_id, event_type, page_url, timestamp'
      );
      error.statusCode = 400;
      return next(error);
    }

    // ── Build the event payload ───────────────────────────────────────────
    const eventData = {
      session_id,
      event_type,
      page_url,
      timestamp: new Date(timestamp),
    };

    // Only include coordinates for click events.
    if (event_type === 'click') {
      eventData.x = x !== undefined ? Number(x) : null;
      eventData.y = y !== undefined ? Number(y) : null;
    }

    // ── Persist ───────────────────────────────────────────────────────────
    const event = await Event.create(eventData);

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    // Forward to the global error handler (handles Mongoose ValidationError, etc.)
    next(error);
  }
};

module.exports = { createEvent };
