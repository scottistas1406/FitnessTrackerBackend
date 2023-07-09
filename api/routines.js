const express = require('express');
const router = express.Router();

const { getRoutineById, addActivityToRoutine, getAllPublicRoutines, createRoutine, updateRoutine, destroyRoutine, getRoutineActivitiesByRoutine } = require('../db');

const { UnauthorizedError, UnauthorizedUpdateError, UnauthorizedDeleteError, DuplicateRoutineActivityError } = require('../errors');

router.get('/', async (req, res, next) => {
  try {
    const routines = await getAllPublicRoutines();

    if (routines) {
      res.send(routines);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.post('/', async (req, res, next) => {
  const { isPublic, name, goal } = req.body;

  if (!req.user) {
    res.status(401).send({
      error: 'Unauthorized',
      message: 'No user found',
      name: UnauthorizedError()
    });
    return;
  }

  try {
    const newRoutine = await createRoutine({
      creatorId: req.user.id,
      isPublic: isPublic,
      name: name,
      goal: goal
    });

    res.send(newRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.patch('/:routineId', async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;
  const updateFields = { id: routineId };

  if (!req.user) {
    res.status(401).send({
      error: 'Unauthorized',
      message: 'No user found',
      name: UnauthorizedError()
    });
    return;
  }

  if (name) {
    updateFields.name = name;
  }
  if (goal) {
    updateFields.goal = goal;
  }
  if (isPublic !== undefined) {
    updateFields.isPublic = isPublic;
  }

  try {
    const routine = await getRoutineById(routineId);

    if (req.user.id !== routine.creatorId) {
      res.status(403).send({
        error: 'Unauthorized',
        message: 'Unauthorized to update this routine',
        name: UnauthorizedUpdateError()
      });
      return;
    }

    const updatedRoutine = await updateRoutine(updateFields);
    res.send(updatedRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.delete('/:routineId', async (req, res, next) => {
  const { routineId } = req.params;

  if (!req.user) {
    res.status(401).send({
      error: 'Unauthorized',
      message: 'No user found',
      name: UnauthorizedError()
    });
    return;
  }

  try {
    const routine = await getRoutineById(routineId);

    if (req.user.id !== routine.creatorId) {
      res.status(403).send({
        error: 'Unauthorized',
        message: 'Unauthorized to delete this routine',
        name: UnauthorizedDeleteError()
      });
      return;
    }

    await destroyRoutine(routineId);
    res.send(routine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.post('/:routineId/activities', async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;

  if (!req.user) {
    res.status(401).send({
      error: 'Unauthorized',
      message: 'No user found',
      name: UnauthorizedError()
    });
    return;
  }

  try {
    const routine = await getRoutineById(routineId);

    if (routine.creatorId !== req.user.id) {
      res.status(403).send({
        error: 'Unauthorized',
        message: 'Error posting routine activities',
        name: DuplicateRoutineActivityError()
      });
      return;
    }

    const updatedActivity = await addActivityToRoutine({ routineId, activityId, count, duration });
    res.send(updatedActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
