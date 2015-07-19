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


var app = express();

require('./middleware')(app)

require('./router')(app);

app.get('/', function (req, res) {
  res.send('Hello World!');
});


var server = app.listen(config.get('server:port'), config.get('server:host'))


module.exports = server;
