var express = require('express');
var router = express.Router();

module.exports = function(passport) {

	/* GET login page. */
	router.get('/', function(req, res, next) {
		res.render('index');
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/query',
		failureRedirect: '/' 
	}));

	return router;
}