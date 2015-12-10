'use strict';

let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
  res.send('/user/');
});


module.exports = router;
