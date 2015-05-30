var express = require('express');
var utils = require('../utils/utils');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

router.get('/', isAuthenticated, function(req, res, next) {
	
	var userId = req.query.id;
	var lat = req.query.lat;
	var lon = req.query.lon;

	var userLocation = new Parse.GeoPoint({latitude: lat, longitude: lon});

	var userQuery = new Parse.Query(Parse.User);
	userQuery.equalTo("objectId", userId);
	userQuery.exists('picture');
	userQuery.first({
		success: function(user) {
			var jsonUser = user.toJSON();
	  	jsonUser.displayName = utils.getDisplayName(jsonUser);
	  	if (jsonUser.location) {
	  		jsonUser.distanceAway = userLocation.milesTo(jsonUser.location);
	  	}
	  	var reviewsQuery = new Parse.Query("Reviews");
	  	reviewsQuery.equalTo("Tutor", jsonUser.username);
	  	reviewsQuery.find({
	  		success: function(reviews) {
	  			jsonUser.reviews = reviews;
	  			utils.sendSuccessResponse(res, {user: jsonUser});
	  		}
	  	});
		}
	});

});

module.exports = router;