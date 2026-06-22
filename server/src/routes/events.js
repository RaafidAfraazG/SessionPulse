/**
 * @file events.js
 * @description Routes for event ingestion.
 *
 * POST /api/events  →  eventController.createEvent
 */

const express = require('express');
const { createEvent } = require('../controllers/eventController');

const router = express.Router();

/**
 * @route  POST /api/events
 * @desc   Ingest a tracking event from the tracker script
 * @access Public
 */
router.post('/', createEvent);

module.exports = router;
