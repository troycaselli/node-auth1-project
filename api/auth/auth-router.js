const bcryptjs = require('bcryptjs');
const router = require('express').Router();
const Users = require('../users/users-model');

const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength} = require('./auth-middleware');


router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const hash = bcryptjs.hashSync(password, 12);
    const newUser = await Users.add({username, password: hash});
    res.status(200).json(newUser);
  } catch(err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const [user] = await Users.findBy({username});
    if(bcryptjs.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({message: `Welcome ${user.username}`});
    } else {
      res.status(401).json({message: 'Invalid credentials'});
    }
  } catch(err) {
    next(err);
  }
});

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */


module.exports = router;