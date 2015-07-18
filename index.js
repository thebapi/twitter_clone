var express       = require('express');
var fixtures      = require('./fixtures');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var passport      = require('./auth');
var util = require('util');
var conn = require('./db')
  , User = conn.model('User'),
  Tweet = conn.model('Tweet');
var config = require('./config');

var ensureAuthentication = require('./middleware/ensureAuthentication');


var app = express();

require('./middleware')(app)


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/api/tweets', function (req, res) {
  var userId = req.query.userId;
  if (!userId) {
    return res.sendStatus(400);
  }

  Tweet.find({userId:userId}).sort({'created': -1}).exec(function (err, tweets) {
    if(err) {
      res.sendStatus(500);
    } else {
      tweets = tweets.map(function (tw) {
        return tw.toClient();
      });
    }
    return res.send({tweets: tweets});
  });



});



app.get('/api/users/:userId', function (req, res) {
  var userId = req.params.userId;
  if (!userId) {
    return res.sendStatus(400);
  }
  User.findOne({id:userId}, function (err, user) {
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


app.put('/api/users/:userId',ensureAuthentication, function (req, res) {
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

app.post('/api/users', function(req, res) {
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

  } );




});


app.post('/api/tweets',ensureAuthentication, function(req, res) {
  var tweet = req.body.tweet;
  var user = req.user;
  if (!user){
    return res.sendStatus(403);

  }
  tweet.userId = user.id;
   util.log("going to store ");
  tweet.created = Date.now()/1000;
  Tweet.create(tweet, function (err, tweet){
    if (err){
       res.sendStatus(500);
    } else {
      res.send({tweet: tweet.toClient()});
    }

  });



});



app.get('/api/tweets/:tweetId', function (req, res) {
  var tweetId = req.params.tweetId;
  if (!tweetId) {
    return res.sendStatus(400);
  }

  Tweet.findById(tweetId, function (err, tweet){

     if (err) {
       return res.sendStatus(500);
     } else {
       if (tweet){

         return res.send({tweet: tweet.toClient()})

       } else {
         return res.sendStatus(404);

       }
     }
  });


});



app.delete('/api/tweets/:tweetId', ensureAuthentication, function (req, res){

  var user = req.user;
  var tweetId = req.params.tweetId;
  if (!tweetId) {
    return res.sendStatus(400);
  }

  Tweet.findById(tweetId, function (err, tweet) {
    if(err){
      res.sendStatus(500);
    } else {

      if (tweet){
        if (tweet.userId == user.id){

          Tweet.findByIdAndRemove(tweetId, function (err){
            if(err){
              res.sendStatus(500);
            } else {
              return res.sendStatus(200);
            }
            });
        } else {
          return res.sendStatus(403);

        }

      } else {
        return res.sendStatus(404);

      }
    }
  });



});




app.post('/api/auth/login', function (req, res) {

  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.sendStatus(500); }
    if (!user) { return res.sendStatus(403 ) }
    req.logIn(user, function(err) {
      if (err) { res.sendStatus(500); }
      return res.send({user: user});
    });
  })(req, res);
});


app.post('/api/auth/logout', function (req, res) {
  req.logout();
// session was cleared, send response to client
  return res.sendStatus(200);

});

var server = app.listen(config.get('server:port'), config.get('server:host'))


module.exports = server;
