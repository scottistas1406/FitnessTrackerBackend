const client = require("./client");


async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routineActivity] } = await client.query(`
    INSERT INTO routine_activities ( "routineId", "activityId", count , duration)
    VALUES($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
      `, [ routineId, activityId, count, duration]);
    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutineActivities() {
  try {
    const {rows} = await client.query(`
      SELECT * FROM routine_activities;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id){
  try {
    const {rows: [routineActivity]} = await client.query(`
      SELECT * FROM routine_activities
      WHERE id = $1
    `, [id]);
    return routineActivity;
  } catch (error) {
    throw error;
  }
}


async function getRoutineActivitiesByRoutine({id}) {
  try {
    const {rows} = await client.query(`
      SELECT * FROM routine_activities
      WHERE "routineId" = ${id}
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}


async function updateRoutineActivity({ id, ...fields }) {
  try {
    const { count, duration } = fields;
    const {
      rows: [activityroutine],
    } = await client.query(
      `UPDATE routine_activities SET count=$1, duration=$2 WHERE id=$3 RETURNING *`,
      [count, duration, id]
    );
    return activityroutine;
  } catch (error) {
    console.log(error);
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {rows: [routineActivity]} = await client.query(`
        DELETE FROM routine_activities 
        WHERE id = $1
        RETURNING *;
    `, [id]);
    return routineActivity;
  } catch (error) {
    throw error;
  }
}


async function canEditRoutineActivity(routineActivityId, userId) {
  const {rows: [routineFromRoutineActivity]} = await client.query(`
      SELECT * FROM routine_activities
      JOIN routines ON routine_activities."routineId" = routines.id
      AND routine_activities.id = $1
    `, [routineActivityId]);
    return routineFromRoutineActivity.creatorId === userId;
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
  getAllRoutineActivities,
};
