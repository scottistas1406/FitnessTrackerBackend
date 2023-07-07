/* eslint-disable no-useless-catch */
const express = require("express");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { UserTakenError, PasswordTooShortError, UnauthorizedError } = require('../errors.js');
const { getUserByUsername, createUser, getUser, getUserById} = require('../db');
const { getPublicRoutinesByUser, getAllRoutinesByUser } = require('../db/routines')
const router = express.Router();

// POST /api/users/register
router.post('/register', async(req, res, next) => {
    const { username, password } = req.body;
    try{
        if (!username || !password) {
            res.send({
              error: 'MissingUsernameOrPassword',
              name: 'Missing username or password',
              message: 'Please enter a username and password',
            });
        } else if (password.length < 8){
            res.send({
                error: 'PasswordTooShort',
                name: 'PasswordTooShort',
                message: PasswordTooShortError(),
              });
        } else {
            const userCheck = await getUserByUsername(username);
            if(userCheck) {
                res.send({
                    error: 'Username already taken',
                    name: 'UsernameAlreadyTaken',
                    message: UserTakenError(userCheck.username),
                  })
          } else {
            const user = await createUser({ username, password });
            if (user) {
                const token = jwt.sign(user, JWT_SECRET);
                res.send({
                    name: 'Success Registering!!!',
                    message: 'Welcome You are Logged in!!!',
                    token,
                    user,
                  });
            }
          }
        }
  } catch(error) {
      next(error);
  }
})

// POST /api/users/login
router.post('/login', async(req, res, next) => {
    const { username } = req.body;
    try {
        const user = await getUser(req.body);
        if(user){
            const token = await jwt.sign({
                id: user.id,
                password: null,
                username
            }, JWT_SECRET);
            res.send({
                message: "you're logged in!",
                user,
                token
            })
        }
    } catch(error) {
        next(error);
    }
})
// GET /api/users/me
router.get('/me', async (req, res, next) => {
    const prefix = 'Bearer ';
    const authHeader = req.header('Authorization');
    
      if (!authHeader) {
        res.status(401).send({
            error: 'UnauthorizedError',
            message: `You must be logged in to perform this action`,
            name: UnauthorizedError()
        });
  
        } else if (authHeader.startsWith(prefix)) {
          const token = authHeader.slice(prefix.length);
        try {
          const { id } = jwt.verify(token, JWT_SECRET);
          if (id) {
            const username = await getUserById(id);
            res.send(username);
          }
        } catch (error) {
          next(error)
      }
    }
  });

// GET /api/users/:username/routines
router.get('/:username/routines', async(req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        const { id } = jwt.verify(token, JWT_SECRET);
        const me = await getUserById(id)
        const { username } = req.params;
        const user = await getUserByUsername(username);
        if(user.username != me.username) {
            const publicRoutines = await getPublicRoutinesByUser(user);
            res.send(publicRoutines);
        } else if(me.username === user.username) {
            const allRoutines = await getAllRoutinesByUser(me);
            res.send(allRoutines);
        }
    } catch(error) {
        next(error);
    }
})
module.exports = router;