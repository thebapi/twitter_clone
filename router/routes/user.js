/**
 * Created by sajibsarkar on 7/19/15.
 */


var express = require('express')
  , router = express.Router();

var conn = require('../../db')
  , User = conn.model('User');

var ensureAuthentication = require('../../middleware/ensureAuthentication');



// POST /api/users/
router.post('/', function (req, res) {
  // handle POST requests to /api/users
  var user = req.body.user
  User.create(user, function(err, userData){
    if (err){

      var code = err.code === 11000 ? 409 : 500
      return res.sendStatus(code)
    }
    req.login(userData, function(err) {

      // handle error
      // session was established, send response to client
      if (err){
        return res.sendStatus(500)
      }  else{
        res.sendStatus(200);
      }
    });

  });
});


// GET /api/users/:userId
router.get('/:userId', function (req, res) {
  // handle GET request to /api/users/:userId
  var userId = req.params.userId;
  if (!userId) {
    return res.sendStatus(400);
  }
  User.findOne({id : userId}, function (err, user) {
    if (err) {
      return res.sendStatus(500);
    } else {
      if (!user) {
        return res.sendStatus(404);
      } else
        return res.send({user: user.toClient()})
    }
  });
});






router.put('/:userId',ensureAuthentication, function (req, res) {
  var password = req.body.password;
  var userId = req.params.userId;

  if (userId != req.user.id){
    return res.send(403);
  }
  User.findOneAndUpdate({id:userId},{password:password}, function (err, user) {
    if (err){
      return res.sendStatus(500);
    } else{
      if (!user) {
        return res.sendStatus(404);
      }
      else
        return res.send({user: user})
    }
  });

});



// etc...

module.exports = router;
