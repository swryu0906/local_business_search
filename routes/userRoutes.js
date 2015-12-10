'use strict';

let express = require('express');
let expressJwt = require('express-jwt');
let router = express.Router();
let userCtrl = require('../controllers/userController')

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * users CRUD routes
 */


router.route('/')


// retrieve all users
router.route('/')
  // .get(expressJwt({ secret: SECRET_KEY }), userCtrl.getUsers)
  .get(userCtrl.getUsers)

// create a new user
  .post(userCtrl.createUser);


// log in
router.route('/login')
  .post(userCtrl.login);


// log out
router.route('/logout')
  .get(userCtrl.logout);


router.route('/:id')
  // .all(expressJwt({ secret: SECRET_KEY }))

  // retrieve a user by id
  .get(userCtrl.getUser)

  // update the user
  .put(userCtrl.updateUser)

  // delete the user
  .delete(userCtrl.deleteUser);

module.exports = router;






module.exports = router;
