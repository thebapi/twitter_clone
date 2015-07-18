/**
 * Created by sajibsarkar on 7/18/15.
 */



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
  userId: String,
  created:  Number,
  text : String,
});

tweetSchema.methods.toClient = function () {
  return {
    id: this._id,
    text: this.text,
    created: this.created,
    userId: this.userId
  }
}

module.exports = tweetSchema;