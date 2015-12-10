'use strict';

let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

router.get('/', (req, res) => {
  res.send('/user/');
});


module.exports = router;
