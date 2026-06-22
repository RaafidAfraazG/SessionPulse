/**
 * @file reset.js
 * @description Route for analytics reset.
 *
 * DELETE /api/events/reset  →  resetController.resetAnalytics
 *
 * Note: This route is mounted under /api/events in app.js, so the full
 * path resolves to DELETE /api/events/reset.
 */

const express = require('express');
const { resetAnalytics } = require('../controllers/resetController');

const router = express.Router();

/**
 * @route  DELETE /api/events/reset
 * @desc   Delete all analytics events (demo/testing only)
 * @access Public (restrict in production via middleware if needed)
 */
router.delete('/reset', resetAnalytics);

module.exports = router;
