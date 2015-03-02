var express = require('express');
var utils = require('../utils/utils');
var router = express.Router();

var proximityRadius = 100; // miles

// TODO : Ensure these are correct fields AND turn into dictionary mapping to displayable names
var subjects = ["Math_and_Applied_Math", "Economics", "Statistics", "Chemistry", "Physics", "Biology", "Computer_Science", "Engineering", "Business", "Psychology", "Government", "English", "History", "Sociology", "Anthropology", "Language_Practice", "Art_and_Design", "General_Writing", "Music", "MCAT", "LSAT", "GRE", "GMAT", "Other_Test_Prep", "Grad_School_Preparation", "Resume_and_Cover_Letter", "Interview_Practice", "Miscellaneous"];

router.get('/', function(req, res, next) {
	//// hardcode test user ////
	var austin = {};
	var mylocation = new Parse.GeoPoint({latitude: 42.35893149070544, longitude: -71.0944369466935});
	austin.location = mylocation;
	austin.firstName = "Austin";
	austin.lastName = "Freel";
	austin.level = "CollegeLevel"; // NOTE: Installation will list as "College"
	////////////////////////////
	
	var subject = req.query.name;

	var query = new Parse.Query(Parse.User);
	query.withinMiles('location', austin.location, proximityRadius);
	query.equalTo(austin.level, true);
	query.exists('available');
	query.exists('picture');
	query.limit(100);

	query.containsAll('Subjects', [subject]);
	query.find({
	  success: function(users) {
	  	var jsonUsers = [];
	  	for (var i = 0; i < users.length; i++) {
	  		var user = users[i].toJSON();
	  		user.displayName = utils.getDisplayName(user);
	  		jsonUsers.push(user);
	  	}
	  	res.render('subject', { users: jsonUsers, subject: subject });
	  }
	});

});

module.exports = router;