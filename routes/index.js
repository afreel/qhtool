var express = require('express');
var router = express.Router();

var _ = require('lodash');

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

	var query = new Parse.Query(Parse.User);
	query.withinMiles('location', austin.location, proximityRadius);
	query.equalTo(austin.level, true);
	query.exists('available');
	query.exists('picture');
	query.limit(6);

	var subjectUsersDict = {};

	var finished = _.after(subjects.length, doRender);

	for (var s = 0; s < subjects.length; s++) {
		(function(subject) {
			var subjectQuery = query;
			subjectQuery.containsAll('Subjects', [subject]);
			subjectQuery.find({
			  success: function(users) {
			  	var jsonUsers = [];
			  	for (var i = 0; i < users.length; i++) {
			  		var user = users[i].toJSON();
			  		var lastInitial = getLastInitial(user.name);
			  		if (user.PreferredName) {
			  			user.displayName = concatName(capitalizeFirstLetter(user.PreferredName), lastInitial);
			  		} else {
			  			user.displayName = concatName(capitalizeFirstLetter(getFirstName(user.name)), lastInitial);
			  		}
			  		jsonUsers.push(user);
			  	}
			  	subjectUsersDict[subject] = jsonUsers;
			  	finished();
			  }
			});
		})(subjects[s]);
	}

	function doRender() {
  	res.render('index', { subjectUsersDict: subjectUsersDict });
	}

	function insertSpaces(phrase) {
		return phrase.split('_').join(' ');
	}

	function getFirstName(name) {
		return name.split(' ')[0];
	}

	function getLastInitial(name) {
		var trimmedName = name.trim();
		var nameArray = trimmedName.split(' ');
		var lastName = nameArray[nameArray.length - 1];
		return lastName.substring(0,1).toUpperCase() + '.';
	}

	function concatName(first, last) {
		return first + ' ' + last;
	}

	function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

});

module.exports = router;