var express = require('express');
var router = express.Router();

var _ = require('lodash');

var defaultRadius = 10; // miles
var defaultLat = 42.35893149070544;
var defaultLon = -71.0944369466935;
var defaultSubject = 'Computer_Science';
var defaultLevel = 'CollegeLevel';

var subjects = ['Biology', 'Chemistry', 'Computer_Science', 'Economics', 'Engineering', 'Finance/Accounting', 'Interview_Practice', 'Job_Search/Prep', 'Language_Practice', 'Math', 'Paper/Essay/Proofreading', 'Physics', 'Psychology', 'Standardized_Test_Prep', 'Statistics', 'Other_Academics', 'Borrowing/Renting', 'Cleaning', 'Companionship', 'Delivery', 'Event_Organizing', 'Moving/Assembling/Fixing', 'Personal_Advice', 'Shopping_Assistant', 'Sports/Fitness/Workout', 'Other_Services'];

router.get('/', function(req, res, next) {
	res.render('index');
});

module.exports = router;