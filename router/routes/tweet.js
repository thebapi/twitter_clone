/**
 * Created by sajibsarkar on 7/19/15.
 */


var express = require('express')
  , router = express.Router();

var conn = require('../../db')
  , Tweet = conn.model('Tweet');

var ensureAuthentication = require('../../middleware/ensureAuthentication');


router.get('/', function (req, res) {
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

router.post('/',ensureAuthentication, function(req, res) {
  var tweet = req.body.tweet;
  var user = req.user;
  if (!user){
    return res.sendStatus(403);

  }
  tweet.userId = user.id;
 tweet.created = Date.now()/1000;
  Tweet.create(tweet, function (err, tweet){
    if (err){
      res.sendStatus(500);
    } else {
      res.send({tweet: tweet.toClient()});
    }

  });



});

router.get('/:tweetId', function (req, res) {
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

router.delete('/:tweetId', ensureAuthentication, function (req, res){

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

module.exports = router;