const client = require("./client");

const { getActivitiesByRoutineId } = require('./activities')
const { getUserByUsername } = require('./users')

async function createRoutine({creatorId, isPublic, name, goal}) {
  try {
    const {rows: [routine]} = await client.query(`
        INSERT INTO routines ("creatorId", "isPublic", "name", "goal")
        VALUES($1, $2, $3, $4)
        RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch (error) {
    throw error;
  }
}


async function getRoutineById(id){
  try {
    const {rows: [routine]} = await client.query(`
      SELECT * FROM routines
      WHERE id = $1
    `, [id]);
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
  try {
    const {rows} = await client.query(`
    SELECT * FROM routines;
    `);
    return rows;
  } catch (error) {
    throw error
  }
}

async function getAllRoutines() {
  try {
    const{rows: routines}= await client.query(`
    SELECT routines.*,user.username AS "creatorName"
    FROM routines 
    JOIN users ON routines."creatorID"=users.id`);
    for (let routine of routines){
      routine.activities = await getActivitiesByRoutineId(routine.id);
    }
    console.log(routines);
    return routines;
  } catch (error){
    throw error
  }
}

async function getAllPublicRoutines() {
  try{
    const {rows:routines} = await client.query(`
    SELECT routines.*,users.username AS "creatorName"
    FROM routines
    JOIN users ON routines.'creatorID'=users.id
    WHERE "isPublic'=true
     `);
     for (let routine of routines){
      routine.activities =await getActivitiesByRoutineId(routine.id);
           }
           return routines;
          } catch (error){
            throw error
          }
  }


async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [routines],
    } = await client.query(
      `
    UPDATE routines
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );

    return routines;
  } catch (error) {
    console.log(error);
  }
}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
