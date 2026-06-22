/**
 * @file resetController.js
 * @description Controller for DELETE /api/events/reset.
 *
 * ⚠️  Demo / testing endpoint only.
 * Permanently deletes ALL events from the database.
 * Useful for resetting state during demos without touching the DB directly.
 */

const Event = require('../models/Event');

/**
 * DELETE /api/events/reset
 *
 * Deletes all Event documents. Returns the count of deleted records.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const resetAnalytics = async (req, res, next) => {
  try {
    const result = await Event.deleteMany({});

    console.log(`🗑   Analytics reset — deleted ${result.deletedCount} event(s).`);

    return res.status(200).json({
      success: true,
      message: `All analytics data has been reset.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { resetAnalytics };
