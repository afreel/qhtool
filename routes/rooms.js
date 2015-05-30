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
	res.send("Please use /rooms/id where id is the roomId");
});

router.get('/:roomId', isAuthenticated, function(req, res, next) {
	var roomId = req.params.roomId;

	var roomQuery = new Parse.Query("Chat");

	roomQuery.equalTo("roomId", roomId);
	roomQuery.ascending("createdAt");

	roomQuery.find({
		success: function(messages) {
			var messagesJSON = messages.map(function(msg) { return msg.toJSON() });
			// NOTE: these user id's are based on the current knowledge of how roomId's are built
			var hostId = roomId.substring(0,10);
			var helperId = roomId.substring(10,20);
			res.render('room', {messages: messagesJSON, hostId: hostId, helperId: helperId, quickhelpId: 'QuickHelp' });
		}
	})
});

module.exports = router;