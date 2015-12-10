'use strict';

let express = require('express');
let router = express.Router();
let request = require('request');
let searchesCtrl = require('../controllers/yelpController');


/**
 * Yelp API OAuth 1.0 keys
 */

const YELP_CONSUMER_KEY = process.env.YELP_CONSUMER_KEY;
const YELP_CONSUMER_SECRET = process.env.YELP_CONSUMER_SECRET;
const YELP_TOKEN = process.env.YELP_TOKEN;
const YELP_TOKEN_SECRET = process.env.YELP_TOKEN_SECRET ;

// Yelp OAuth 1.0
let oauth = {
  consumer_key: YELP_CONSUMER_KEY,
  consumer_secret: YELP_CONSUMER_SECRET,
  token: YELP_TOKEN,
  token_secret: YELP_TOKEN_SECRET,
};

/**
 * Yelp local search API
 */

let search = (req, res, next) => {

  const YELP_API_SEARCH_URL = 'https://api.yelp.com/v2/search/?';

  let searchQuery = '';
  if (req.query.location) searchQuery += 'location=' + req.query.location + '&';
  if (req.query.latitude) searchQuery += 'latitude=' + req.query.latitude + '&';
  if (req.query.longitude) searchQuery += 'longitude=' + req.query.longitude; + '&';
  if (req.query.term)  searchQuery += 'term=' + req.query.term + '&';
  if (req.query.limit) searchQuery += 'limit=' + req.query.limit + '&';
  if (req.query.offset) searchQuery += 'offset=' + req.query.offset + '&';
  if (req.query.sort) searchQuery += 'sort=' + req.query.sort + '&';
  if (req.query.category_filter) searchQuery += 'category_filter=' + req.query.category_filter + '&';
  if (req.query.radius_filter) searchQuery += 'radius_filter=' + req.query.radius_filter + '&';
  if (req.query.deals_filter) searchQuery += 'deals_filter=' + req.query.deals_filter;

  // remove the last '&' character in searchQuery
  if (searchQuery.charAt(searchQuery.length - 1) === '&') searchQuery = searchQuery.substring(0, searchQuery.length - 1)


  let url = YELP_API_SEARCH_URL + searchQuery;

  // // Yelp OAuth 1.0
  // let oauth = {
  //   consumer_key: YELP_CONSUMER_KEY,
  //   consumer_secret: YELP_CONSUMER_SECRET,
  //   token: YELP_TOKEN,
  //   token_secret: YELP_TOKEN_SECRET,
  // };

  request.get({ url: url, oauth: oauth }, (error, response, body) => {
    res.send(body);
  });
};

/**
 * Yelp business search API
 */

let business_search = (req, res, next) => {

  const YELP_API_BUSINESS_SEARCH_URL = 'https://api.yelp.com/v2/business/';

  let searchQuery = '';
  if (req.query.business_id) searchQuery += req.query.business_id + '?';
  if (req.query.cc) searchQuery += 'cc=' + req.query.cc + '&';
  if (req.query.lang) searchQuery += 'lang=' + req.query.lang + '&';
  if (req.query.lang_filter) searchQuery += 'lang_filter=' + req.query.lang_filter + '&';
  if (req.query.actionlinks) searchQuery += 'actionlinks=' + req.query.actionlinks;

  // remove the last '&' character in searchQuery
  if (searchQuery.charAt(searchQuery.length - 1) === '&') searchQuery = searchQuery.substring(0, searchQuery.length - 1)


  let url = YELP_API_BUSINESS_SEARCH_URL + searchQuery;

  request.get({ url: url, oauth: oauth }, (error, response, body) => {
    res.send(body);
  });
};

/**
 * Yelp phone search API
 */

let phone_search = (req, res, next) => {

  const YELP_API_PHONE_SEARCH_URL = 'https://api.yelp.com/v2/phone_search/?';

  let searchQuery = '';
  if (req.query.phone) searchQuery += 'phone=' + req.query.phone + '&';
  if (req.query.category) searchQuery += 'category=' + req.query.category + '&';
  if (req.query.cc) searchQuery += 'cc=' + req.query.cc;

  // remove the last '&' character in searchQuery
  if (searchQuery.charAt(searchQuery.length - 1) === '&') searchQuery = searchQuery.substring(0, searchQuery.length - 1)


  let url = YELP_API_PHONE_SEARCH_URL + searchQuery;

  request.get({ url: url, oauth: oauth }, (error, response, body) => {
    res.send(body);
  });
};


module.exports = {
  search: search,
  business_search: business_search,
  phone_search: phone_search
}
