/**
 * Created by sajibsarkar on 7/18/15.
 */


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fixtures = require('./fixtures');
var bcrypt =require('bcrypt');
var _ = require('underscore');

var conn = require('./db')
  , User = conn.model('User');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({id: id}, function (err, user) {
    if (err) {
      done(err, null);
    } else {
      if (user) {
        done(null, user.toClient());
      } else {
        done(null, null);
      }

    }

  });
});


passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({id: username}, function (err, user) {
      if (err) {
        done(err, null);
      } else {
        if (!user) {
          return done(null, false, {message: 'Incorrect username.'});
        }

        if (user && user.password) {
          bcrypt.compare(password, user.password, function(err, res) {
            if (res === true){
              return done(null, user);
            } else {
              return done(null, false, {message: 'Incorrect password.'});
            }
          });

        }
      }
    });

  }
));


module.exports = passport;