/* eslint-disable no-useless-catch */
const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "ourSecret"} = process.env;
const { UserTakenError, PasswordTooShortError, UnauthorizedError } = require('../errors.js');
const { getUserByUsername, createUser, getUser, getUserById, getPublicRoutinesByUser, getAllRoutinesByUser} = require('../db');
const router = express.Router();

// POST /api/users/register
router.post('/register', async(req, res, next) => {
  try{
      const { username, password } = req.body;
      const userCheck = await getUserByUsername(username);
      if(userCheck) {
          res.send({
              "error": 'User Already Exists',
              "message":`${UserTakenError(username)}`,
              "name": `UserTakenError`
          })
      }
      
      if (password.length < 8) {
          res.send({
              "error": 'Password is too short',
              "message": `${PasswordTooShortError()}`,
              "name": `PasswordTooShortError`
      })
      } else {
          const user = await createUser(req.body);
          const token = jwt.sign(
              { id: user.id, username: user.username },
              JWT_SECRET,
              { expiresIn: "1w" }
          );
          
          if(user) res.send({
              "message": 'You have registered',
              "user": user,
              "token": token
          });
      }
  } catch(error) {
      next(error);
  }
})
// POST /api/users/login
router.post('/login', async(req, res, next) => {
    try {
        const user = await getUser(req.body);
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1w" }
        );
        res.send({
            message: "you're logged in!",
            user: user,
            token: token
        })
    } catch(error) {
        next(error);
    }
})
// GET /api/users/me
router.get('/me', async(req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if(!authHeader) {
            const unAuth = UnauthorizedError();
            res.status(401).send({
                "error": 'UnauthorizedError',
                "message": `${unAuth}`,
                "name": `UnauthorizedError`
            })
        } else {
            const token = authHeader.split(' ')[1];
            const { id } = jwt.verify(token, JWT_SECRET);
            if(id) {
                const user = await getUserById(id);
                res.send(user)
            }
        }
    } catch (error) {
        next(error);
    }
})

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