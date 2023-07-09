const express = require('express');
const client = require("../db/client");
const router = express.Router();
const { updateRoutineActivity, getRoutineActivityById, getRoutineById, destroyRoutineActivity} = require("../db");
const{ UnauthorizedUpdateError, UnauthorizedDeleteError } = require('../errors')


function requireUser(req, res, next) {
    console.log("req.user:", req.user);
    if (!req.user) {
        next({
            name: "MissingUserError",
            message: "You must be logged in to perform this action"
        });
    }

    next();
}


// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async(req, res, next) => {
    const {routineActivityId} = req.params;
    const {count, duration} = req.body;
    const originalRoutineActivity = await getRoutineActivityById(routineActivityId)
    const {routineId} = originalRoutineActivity
    const routine = await getRoutineById(routineId)
    try {
        if(originalRoutineActivity && routine.creatorId === req.user.id){
            const updatedRoutineActivity = await updateRoutineActivity({id: routineActivityId, count, duration});
            res.send(updatedRoutineActivity)
        } else {
            res.status(403);
            res.send({
                error: 'UnauthorizedUpdateError',  
                message: `User ${req.user.username} is not allowed to update ${routine.name}`,
                name: UnauthorizedUpdateError()
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
});
// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async(req, res, next) => {
    const {routineActivityId} = req.params;
    const routineActivityToDelete = await getRoutineActivityById(routineActivityId);
    const {routineId} = routineActivityToDelete;
    const routine = await getRoutineById(routineId);
    try {
        if(routineActivityToDelete && routine.creatorId === req.user.id){
            const destroyedRoutineActivity = await destroyRoutineActivity(routineActivityId);
            res.send(destroyedRoutineActivity)
        } else{
            res.status(403);
            res.send({
                error: 'UnauthorizedDeleteError',
                message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
                name: UnauthorizedDeleteError()
            })
        }
    } catch ({name, message}) {
        next({name, message})
    }
});

module.exports = router;
