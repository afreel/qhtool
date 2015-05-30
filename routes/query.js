var express = require('express');
var router = express.Router();

var _ = require('lodash');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

// DEFAULT values for initial query
var defaultRadius = 10; // miles
var defaultLat = 42.35893149070544;
var defaultLon = -71.0944369466935;
var defaultSubject = 'Computer_Science';
var defaultLevel = 'CollegeLevel';

var upperLimit = 1000; // this is the most that Parse can return in one query

// var subjects = ['Biology', 'Chemistry', 'Computer_Science', 'Economics', 'Engineering', 'Finance/Accounting', 'Interview_Practice', 'Job_Search/Prep', 'Language_Practice', 'Math', 'Paper/Essay/Proofreading', 'Physics', 'Psychology', 'Standardized_Test_Prep', 'Statistics', 'Other_Academics', 'Borrowing/Renting', 'Cleaning', 'Companionship', 'Delivery', 'Event_Organizing', 'Moving/Assembling/Fixing', 'Personal_Advice', 'Shopping_Assistant', 'Sports/Fitness/Workout', 'Other_Services'];

router.get('/', isAuthenticated, function(req, res, next) {

	var queryDict = {};

	var subject = req.query.subject;
	if ((typeof subject == 'undefined') || (subject.length == 0)) {
		subject = defaultSubject;
	}
	var radius = parseInt(req.query.radius);
	if (isNaN(radius)) {
		radius = defaultRadius;
	}
	var lat = parseFloat(req.query.lat);
	if (isNaN(lat)) {
		lat = defaultLat;
	}
	var lon = parseFloat(req.query.lon);
	if (isNaN(lon)) {
		lon = defaultLon;
	}
	var limit = req.query.limit;

	var location = new Parse.GeoPoint({latitude: lat, longitude: lon});

	var query = new Parse.Query(Parse.User);
	query.withinMiles('location', location, radius);
	// query.equalTo(defaultLevel, true);
	// query.exists('available');
	query.exists('picture');
	query.notEqualTo('picture', null);

	if (typeof limit != 'undefined') {
		query.limit(limit);
	} else {
		query.limit(upperLimit);
	}
	
	query.containsAll('Subjects', [subject]);

	queryDict['subject'] = subject;
	queryDict['lat'] = lat;
	queryDict['lon'] = lon;
	queryDict['radius'] = radius;

	var subjectUsersDict = {};

	query.find({
	  success: function(users) {
	  	console.log(users.length);
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
	  	doRender();
	  }
	});

	// ~~~ Code below was used to query all subjects for front page ~~~
	// 
	// var subjectUsersDict = {};
	// 
	// var finished = _.after(subjects.length, doRender);

	// for (var s = 0; s < subjects.length; s++) {
	// 	(function(subject) {
	// 		var subjectQuery = query;
	// 		subjectQuery.containsAll('Subjects', [subject]);
	// 		subjectQuery.find({
	// 		  success: function(users) {
	// 		  	var jsonUsers = [];
	// 		  	for (var i = 0; i < users.length; i++) {
	// 		  		var user = users[i].toJSON();
	// 		  		var lastInitial = getLastInitial(user.name);
	// 		  		if (user.PreferredName) {
	// 		  			user.displayName = concatName(capitalizeFirstLetter(user.PreferredName), lastInitial);
	// 		  		} else {
	// 		  			user.displayName = concatName(capitalizeFirstLetter(getFirstName(user.name)), lastInitial);
	// 		  		}
	// 		  		jsonUsers.push(user);
	// 		  	}
	// 		  	subjectUsersDict[subject] = jsonUsers;
	// 		  	finished();
	// 		  }
	// 		});
	// 	})(subjects[s]);
	// 	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// 	

	function doRender() {
  	res.render('query', { subjectUsersDict: subjectUsersDict, queryDict: queryDict });
	}

	function insertSpaces(phrase) {
		return phrase.split('_').join(' ');
	}

	function getFirstName(name) {
		if (name) {
			return name.split(' ')[0];
		}
		return null;
	}

	function getLastInitial(name) {
		if (name == null) {
			return null;
		}
		var trimmedName = name.trim();
		var nameArray = trimmedName.split(' ');
		if (nameArray.length <= 1) {
			return null;
		}
		var lastName = nameArray[nameArray.length - 1];
		return lastName.substring(0,1).toUpperCase() + '.';
	}

	function concatName(first, last) {
		if (first) {
			if (last) {
				return first + ' ' + last;
			}
			return first;
		}
		return '';
	}

	function capitalizeFirstLetter(string) {
		if (string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		return string;
  }

});

module.exports = router;