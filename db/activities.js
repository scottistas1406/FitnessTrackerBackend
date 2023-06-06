const client = require('./client');

// database functions
async function createActivity({ name, description }){
  try {
    const {rows: [activity]} = await client.query(`
      INSERT INTO activities(name, description) VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING 
      RETURNING *
    `, [name, description]);
    return activity;
  } catch (error) {
    throw error;
  }}

  async function getAllActivities(){
    try {
      const {rows} = await client.query(`
        SELECT * FROM activities;
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  }


  async function getActivityById(id){
    try {
      const {rows: [activity]} = await client.query(`
        SELECT * FROM activities
        WHERE id = $1
      `, [id]);
      return activity;
    } catch (error) {
      throw error;
    }
  }

  async function getActivityByName(name){
    try {
      const {rows: [activity]} = await client.query(`
        SELECT * FROM activities
        WHERE name = $1
      `, [name]);
      return activity;
    } catch (error) {
      throw error;
    }
  }

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  // build the set string

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }
  try {
    const {
      rows: [activities],
    } = await client.query(
      `
      UPDATE activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return activities;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
