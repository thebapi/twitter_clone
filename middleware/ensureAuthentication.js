/**
 * Created by sajibsarkar on 7/19/15.
 */


module.exports = function(req, res, next) {
  // Your ensureAuthentication implementation
  if (!req.isAuthenticated()) {
    res.sendStatus(403);
  } else {
    next(null);
  }
}