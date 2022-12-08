const Users = require('../users/users-model');

function restricted(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    next({status: 401, message: 'You shall not pass!'});
  }
}

async function checkUsernameFree(req, res, next) {
  try {
    const [existing] = await Users.findBy({username: req.body.username});
    if(existing) {
      res.status(422).json({message: 'Username taken'});
    } else {
      next();
    }
  } catch(err) {
    next(err)
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const {username} = req.body;
    const [user] = await Users.findBy({username});
    if(user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({message: 'Invalid credentials'});
    }
  } catch (err) {
    next(err);
  }
}

function checkPasswordLength(req, res, next) {
  if(!req.body.password || req.body.password.length <= 3) {
    res.status(422).json({message: 'Password must be longer than 3 chars'});
  } else {
    next();
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}