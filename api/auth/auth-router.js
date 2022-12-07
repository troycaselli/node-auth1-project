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

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const {username, password} = req.body;
    const [user] = await Users.findBy({username});
    if(user && bcryptjs.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({message: `Welcome ${user.username}`});
    } else {
      res.status(401).json({message: 'Invalid credentials'});
    }
  } catch(err) {
    next(err);
  }
});

router.get('/logout', (req, res, next) => {
  if(req.session.user) {
    req.session.destroy(err => {
      if(err) {
        res.status(200).json({message: 'logout failed'});
      } else {
        res.set('Set-Cookie', 'monkey=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00');
        res.status(200).json({message: 'logged out'});
      }
    })
  } else {
    res.status(200).json({message: 'no session'});
  }
})

module.exports = router;