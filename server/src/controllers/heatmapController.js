/**
 * @file heatmapController.js
 * @description Controller for GET /api/heatmap?page=<page_url>.
 *
 * Returns all click events for a given page URL.
 * The response is a lightweight array of {x, y, timestamp, session_id}
 * objects — exactly what a heatmap visualisation needs.
 */

const Event = require('../models/Event');

/**
 * GET /api/heatmap
 *
 * Query params:
 *  - page (required): URL-encoded page URL to fetch click data for.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const getHeatmap = async (req, res, next) => {
  try {
    const { page } = req.query;

    // ── Validate query param ──────────────────────────────────────────────
    if (!page) {
      const error = new Error('Missing required query parameter: page');
      error.statusCode = 400;
      return next(error);
    }

    // Decode in case the client URL-encoded the page URL.
    const decodedPage = decodeURIComponent(page);

    // ── Query — only click events, only coordinates + metadata ───────────
    // Uses the compound index (page_url, event_type) for efficiency.
    const clicks = await Event.find(
      {
        page_url: decodedPage,
        event_type: 'click',
      },
      // Projection — only return fields useful for the heatmap renderer.
      {
        _id: 0,
        x: 1,
        y: 1,
        timestamp: 1,
        session_id: 1,
      }
    )
      .sort({ timestamp: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      page: decodedPage,
      count: clicks.length,
      data: clicks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHeatmap };
