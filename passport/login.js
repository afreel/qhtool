var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var users = [
    { id: 1, username: 'afreel', password: 'qhteam' },
    { id: 2, username: 'hikari', password: 'qhteam' },
    { id: 3, username: 'mazen', password: 'qhteam' }
];

module.exports = function(passport) {

  passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
  }));

  function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.username === username) {
        return fn(null, user);
      }
    }
    return fn(null, null);
  }

  // NOTE: not currently used
  var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
  }
  
}