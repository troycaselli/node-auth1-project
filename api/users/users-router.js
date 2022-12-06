// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require('express').Router();
const Users = require('./users-model');


router.get('/', async (req, res, next) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    }  catch(err) {
      next(err);
    }
})

/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */


module.exports = router;