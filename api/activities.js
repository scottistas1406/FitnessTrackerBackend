const express = require('express');
const router = express.Router();
const { ActivityExistsError, ActivityNotFoundError } = require('../errors');
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require('../db');

// GET /api/activities
router.get('/', async (req, res, next) => {
  try {
    // TODO: Implement the logic to get all activities
    const activities = await getAllActivities();
    res.send(activities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities
router.post('/', async (req, res, next) => {
  try {
    // TODO: Implement the logic to create a new activity
    const { name, description } = req.body;
    const activity = await createActivity(name, description);
    res.send(activity);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
router.patch('/:activityId', async (req, res, next) => {
  try {
    // TODO: Implement the logic to update the activity
    const activityId = req.params.activityId;
    const { name, description } = req.body;
    const updatedActivity = await updateActivity(activityId, name, description);
    res.json(updatedActivity);
  } catch (error) {
    next(error);
  }
});

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
    try {
      // TODO: Implement the logic to get routines for the specified activityId
      const activityId = req.params.activityId;
      const routines = await getPublicRoutinesByActivity(activityId);
      res.json(routines);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
