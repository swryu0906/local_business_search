'use strict';

let User = require('../models/user');
let jwt = require('jsonwebtoken');
let expressValidator = require('express-validator');

const SECRET_KEY = process.env.SECRET_KEY;


/**
 * retrieve all users
 */

let getUsers = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      return res.json({
        success: false,
        message: err.message,
        error: err
      });
    }
    // returned json users will not have passwords 
    let parsedUsers = users.map((user) => {
      user.password = undefined;
      return user;
    })
    res.status(200).json({
      success: true,
      users: parsedUsers
    });
  });
};


/**
* create a user (user registration)
*/

let createUser = (req, res, next) => {
  req.checkBody('firstName', 'First name field is required').notEmpty();
  req.checkBody('lastName', 'Last name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be a valid email address').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('passwordConfirmation', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();
  if (errors) {
    console.log('Error: ' + errors)
    res.status(401).json({
      success: false,
      error: errors
    });
  } else {

    let userObject = {};
    userObject.name = {};
    // let userObject = new User();

    userObject.name.firstName = req.body.firstName;
    userObject.name.lastName = req.body.lastName;
    userObject.username = req.body.username;
    userObject.email = req.body.email;
    userObject.password = req.body.password;
    if (req.body.middleName) userObject.name.middleName = req.body.middleName;

    let newUser = new User(userObject);

    newUser.save((err, user) => {
      if (err) {
        console.log('Error: ' + err);
        res.status(401).json({
          success: false,
          error: err
        });
      } else {
        let token = jwt.sign(user, SECRET_KEY, { expiresInMinutes: 120 });
        console.log('Success: ' + user.name.firstName + ' ' + user.name.lastName +
          ' is assigned a new token. \n' +
          'token: ' + token);
        res.status(200).json({
          success: true,
          message: 'You are now successfully registered and logged in',
          user: user,
          token: token
        });
      }
    });
	}
}


/**
* retrieve one user
*/

let getUser = (req, res, next) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      console.log('Error: ' + err);
      return res.status(401).json({
        success: false,
        message: err.message,
        error: err
      });
    } else {
      return res.status(200).json({
        success: true,
        user: user
      });
    }
  });
};


/**
* update the user
*/

let updateUser = (req, res, next) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      console.log('Error: ' + err);
      return res.status(401).json({
        success: false,
        message: err.message,
        error: err
      });
    } else {
      let userObject = { name: {} };

      if (req.body.firstName) userObject.name.firstName = req.body.firstName;
      if (req.body.lastName) userObject.name.lastName = req.body.lastName;
      if (req.body.middleName) userObject.name.middleName = req.body.middleName;
      if (req.body.username) userObject.username = req.body.username;
      if (req.body.email) {
        req.checkBody('email', 'Email must be a valid email address').isEmail();
        userObject.email = req.body.email;
      }
      if (req.body.password && req.body.passwordConfirmation) {
        req.checkBody('passwordConfirmation', 'Passwords do not match').equals(req.body.password);
        userObject.password = req.body.password;
      }

      let errors = req.validationErrors();

      if (errors) {
        console.log('Error: ' + errors)
        res.json({
          success: false,
          error: errors
        });
      } else {
        user.update(
          // {
          //   email: req.body.email,
          //   password: req.body.password
          // },
          userObject,
          (err, updatedUser) => {
            if (err) {
              return res.status(401).json({
                success: false,
                message: err.message,
                error: err
              });
            } else {
              updatedUser.password = undefined;
              return res.status(200).json({
                success: true,
                message: 'User was successfully updated',
                user: updatedUser
              });
            }
          }
        );
      }
    }
  });
};


/**
* delete the user
*/

let deleteUser = (req, res, next) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      console.log('Error: ' + err);
      return res.status(401).json({
        success: false,
        message: err.message,
        error: err
      });
    } else {
      user.remove((err) => {
        if (err) {
          return res.status(401).json({
            success: false,
            message: err.message,
            error: err
          });
        } else {
          return res.status(200).json({
            success: true,
            message: 'User was successfully deleted'
          });
        }
      });
    }
  });
};


/**
* local login
*/

let login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email must be a valid email address').isEmail();
  req.checkBody('password', 'Password field is required').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    console.log('Error: ' + errors);
    res.status(401).json({
      success: false,
      error: errors
    });
  } else {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {
        console.log('Error: ' + err);
        res.status(401).json({
          success: false,
          error: err
        });
      }
      // whether user exists
      if(!user){
        console.log('Error: User is not found');
        res.status(401).json({
          success: false,
          message: 'User is not found'
        });
      } else {
        // Is Password Valid?
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            console.log('Error: ' + err);
            res.status(401).json({
              success: false,
              error: err
            });
          }
          if (isMatch) {
            console.log('Success: You are successfully logged in');

            let token = jwt.sign(user, SECRET_KEY, { expiresInMinutes: 120 });
            user.password = undefined;
            res.status(200).json({
              success: true,
              message: 'You are successfully logged in',
              user: user,
              token: token
            });
          } else {
            console.log('Error: Password is invalid');
            res.status(401).json({
              success: false,
              message: 'Password is invalid'
            });
          }
        });
      }
    });
  }
};


/**
* local logout
*/

let logout = (req, res, next) => {
  req.status(200).json({
    success: true,
    message: 'You successfully logged out'
  });
};


module.exports = {
  getUsers: getUsers,
  createUser: createUser,
  getUser: getUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  login: login,
  logout: logout
}
