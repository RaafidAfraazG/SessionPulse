/**
 * @file heatmap.js
 * @description Routes for heatmap data.
 *
 * GET /api/heatmap?page=<url>  →  heatmapController.getHeatmap
 */

const express = require('express');
const { getHeatmap } = require('../controllers/heatmapController');

const router = express.Router();

/**
 * @route  GET /api/heatmap
 * @desc   Return click coordinates for a given page URL
 * @access Public
 */
router.get('/', getHeatmap);

module.exports = router;
