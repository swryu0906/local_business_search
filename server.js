'use strict';


/**
 * npm dependencies
 */

let bodyParser = require('body-parser');
let cors = require('cors');
let dotenv = require('dotenv');
let errorhandler = require('errorhandler');
let express = require('express');
let expressValidator = require('express-validator');
let mongoose = require('mongoose');
let logger = require('morgan');

let app = express();
dotenv.load();


/**
 * db configuration
 */

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/localBusinessSearchDB')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
  console.log('mongoose connected');
});


/**
 * routes configuration
 */

let userRoutes = require('./routes/userRoutes');
// let yelpRoutes = require('./routes/yelpRoutes');


/**
 * parser configuration
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// StatusError handling
app.use((err, req, res, next) => {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});


/**
 * development environment setup
 */


if (process.env.NODE_ENV == 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

/**
 * express-validator configuration
 */

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
     var namespace = param.split('.')
     , root    = namespace.shift()
     , formParam = root;

   while(namespace.length) {
     formParam += '[' + namespace.shift() + ']';
   }
   return {
     param : formParam,
     msg   : msg,
     value : value
   };
  }
}));


/**
 * routes setup
 */

app.use('/user', userRoutes);
// app.use('/yelp', yelpRoutes);


/**
 * server configuration
 */

let server = app.listen(process.env.PORT || 3001, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Local Business Seach Backend App is running', 'host: ' + host, 'port: ' + port);
});
