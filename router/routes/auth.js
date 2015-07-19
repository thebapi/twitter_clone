/**
 * Created by sajibsarkar on 7/19/15.
 */



var express = require('express')
  , router = express.Router();
var passport = require("passport");

var util = require('util');


router.post('/login', function (req, res) {

  util.log("Going to auth");
  passport.authenticate('local', function (err, user, info) {
    util.log("Received user");
    util.log(util.inspect(user));
    if (err) { return res.sendStatus(500); }
    if (!user) { return res.sendStatus(403 )}

    req.logIn(user, function(err) {
      if (err) { res.sendStatus(500); }
      return res.send({user: user.toClient()});
    });
  })(req, res);
});


router.post('/logout', function (req, res) {
  req.logout();
// session was cleared, send response to client
  return res.sendStatus(200);

});


module.exports = router;