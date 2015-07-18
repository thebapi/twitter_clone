/**
 * Created by sajibsarkar on 7/19/15.
 */

var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var passport      = require('../auth');


module.exports = function(app) {
  app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
  app.use(bodyParser.json());
  app.use(cookieParser());


  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  // add here all the application level middleware
  // that your app needs to use.
}