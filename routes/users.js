var express = require('express');
var utils = require('../utils/utils');
var router = express.Router();

router.get('/', function(req, res, next) {
	
	var userId = req.query.id;

	var userQuery = new Parse.Query(Parse.User);
	userQuery.equalTo("objectId", userId);
	userQuery.exists('picture');
	userQuery.first({
		success: function(user) {
			var jsonUser = user.toJSON();
	  	jsonUser.displayName = utils.getDisplayName(jsonUser);
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