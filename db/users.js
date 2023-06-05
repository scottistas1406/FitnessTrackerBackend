const client = require("./client");
const bcrypt=require('bcrypt');
const SALT_COUNT = 10;

// database functions

// user functions
async function createUser({ username, password }) {
  
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
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
  if (!username || !password) {
    return;
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) return;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
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

