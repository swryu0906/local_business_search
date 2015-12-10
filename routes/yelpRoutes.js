'use strict';

let express = require('express');
let router = express.Router();
let yelpCtrl = require('../controllers/yelpController');


/**
 * search API routes
 */

// retrieve Yelp search results
router.route('/search')
  .get(yelpCtrl.search);

router.route('/phone_search')
  .get(yelpCtrl.phone_search);

router.route('/business_search')
  .get(yelpCtrl.business_search);

module.exports = router;
