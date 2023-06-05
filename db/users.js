const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
    const values = [username, password];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user');
    throw error;
  }
}

async function getUser({ username, password }) {
  // Implement the logic to retrieve a user by their username and password
}

async function getUserById(userId) {
  // Implement the logic to retrieve a user by their user ID
}

async function getUserByUsername(userName) {
  // Implement the logic to retrieve a user by their username
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};

