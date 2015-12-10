'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

const  SALT_WORK_FACTOR = process.env.SALT_WORK_FACTOR;


/**
 * User model schema
 */

let userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  // name: { type: String, required: true },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String }
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // photos: [
  //   photo: String
  // ],
  created_at: { type: Date },
  updated_at: { type: Date }
});


/**
 * save created_at, updated_at and hashed password
 */

userSchema.pre('save', function(next) { // function expression is needed
  let currentUser = this;
  currentUser.updated_at = new Date();
  if (!currentUser.created_at) currentUser.created_at = currentUser.updated_at;

  if (!currentUser.isModified('password')) return next();

  // generate a salt with a predefined SALT_WORK_FACTOR
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    // hash the password using the new salt
    bcrypt.hash(currentUser.password, salt, (err, hash) => {
      if (err) return next(err);

      // replace the plain text password with the hashed one
      currentUser.password = hash;
      next();
    });
  });
});


/**
 * comparePassword method for comparing a plain text password with hashed one
 */

userSchema.methods.comparePassword = (candidatePassword, callback) => {
  // bcrypt.compare is a method which will return a boolean value
  // after comparing a plain text password with the hashed password
  let currentUser = this;
  bcrypt.compare(candidatePassword, currentUser.password, (err, isMatch) => {
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
