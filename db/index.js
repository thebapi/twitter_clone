/**
 * Created by sajibsarkar on 7/18/15.
 */

 var mongoose = require("mongoose");

var config = require('../config');


var userSchema = require('./schemas/user');
var tweetSchema = require('./schemas/tweet');


var conn = mongoose.createConnection(config.get('database:host'), config.get('database:name'),  config.get('database:port'));

conn.model('User',userSchema);
conn.model('Tweet',tweetSchema);
module.exports = conn;