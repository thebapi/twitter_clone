/**
 * Created by sajibsarkar on 7/18/15.
 */



var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");



var userSchema = new Schema({
  id:  { type: String, unique: true},
  name: String,
  email:   { type: String, unique: true},
  password: String,
  followingIds: {type:[String], default: [] }
});


userSchema.pre('save', function (next) {
  // get encrypted value of this.password
  // assign encrypted value to this.password
  // call next() when you're done
  var me = this;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(me.password, salt, function (err, hash) {
      me.password = hash;
      next();
    });
  });

});

module.exports = userSchema;