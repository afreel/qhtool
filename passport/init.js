var login = require('./login');

var users = [
    { id: 1, username: 'XXXXXX', password: 'XXXXXX' },
    { id: 2, username: 'XXXXXX', password: 'XXXXXX' },
    { id: 3, username: 'XXXXXX', password: 'XXXXXX' }
];

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: '); console.log(user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        findById(id, function (err, user) {
            done(err, user);
        });
    });

    function findById(id, fn) {
      var idx = id - 1;
      if (users[idx]) {
        fn(null, users[idx]);
      } else {
        fn(new Error('User ' + id + ' does not exist'));
      }
    }

    // Setting up Passport Strategy for Login
    login(passport);

}