const express = require('express');
const router = express.Router();

const {getRoutineById, addActivityToRoutine, getAllPublicRoutines, createRoutine, updateRoutine, destroyRoutine, getRoutineActivitiesByRoutine } = require('../db');

const {UnauthorizedError, UnauthorizedUpdateError, UnauthorizedDeleteError} = require('../errors');
// GET /api/routines

router.get('/', async(req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();

        if(routines){
            res.send(routines)
        }
    } catch ({name, message}) {
        next({name, message})
    }
});



// POST /api/routines
router.post('/', async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    user = req.body;
    //console.log(user)
    if (!user) {
      res.send({
        error: 'No user found',
        message: UnauthorizedError(),
        name: 'Unauthorized Error'
      })
    }
    try {
      const newRoutine = await createRoutine({
        creatorId: req.user.id, 
        isPublic: isPublic,
        name: name,
        goal: goal
      });
      res.send(newRoutine);
    }catch ({name, message}) {
      next({name, message})
    }
  });

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
