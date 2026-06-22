/**
 * @file sessions.js
 * @description Routes for session querying.
 *
 * GET /api/sessions            →  sessionController.getSessions
 * GET /api/sessions/:sessionId →  sessionController.getSessionById
 */

const express = require('express');
const { getSessions, getSessionById } = require('../controllers/sessionController');

const router = express.Router();

/**
 * @route  GET /api/sessions
 * @desc   List all sessions with summary stats (total_events, last_activity)
 * @access Public
 */
router.get('/', getSessions);

/**
 * @route  GET /api/sessions/:sessionId
 * @desc   Get ordered events for a specific session
 * @access Public
 */
router.get('/:sessionId', getSessionById);

module.exports = router;
