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

	var quickhelpRequestsQuery = new Parse.Query("QuickhelpRequests");
	var quickhelperRequestsQuery = new Parse.Query("QuickhelperRequests");

	// NOTE: this works for now because < 1K requests, but will need to use iterative requests later
	quickhelpRequestsQuery.limit(1000);
	quickhelperRequestsQuery.limit(1000);

	quickhelpRequestsQuery.descending("createdAt");
	quickhelperRequestsQuery.descending("createdAt");

	var promises = [];

	promises.push(quickhelpRequestsQuery.find());
	promises.push(quickhelperRequestsQuery.find());

	Parse.Promise.when(promises).then(function(quickhelpRequests, quickhelperRequests) {
		var quickhelpRequestsJSON = quickhelpRequests.map(function(req) { return req.toJSON() });
		var quickhelperRequestsJSON = quickhelperRequests.map(function(req) { return req.toJSON() });
		res.render('requests', { quickhelpRequests: quickhelpRequestsJSON, quickhelperRequests: quickhelperRequestsJSON });
	});

	// This function can be used to get number of responses, but it takes a long time to run
	// function addNumResponses(request) {
	// 	var requestJSON = request.toJSON();
	// 	var roomsQuery = new Parse.Query("Chat");

	// 	// NOTE: we currently get the messages with the same text that are created within 10000ms = 10s of creation due to timing differences in Parse
	// 	var createDate = new Date(requestJSON.createdAt);
	// 	roomsQuery.greaterThan("createdAt", createDate);
	// 	var createDateBuffer = new Date(Date.parse(createDate) + 10000);
	// 	roomsQuery.lessThan("createdAt", createDateBuffer);

	// 	roomsQuery.limit(1000);
	// 	roomsQuery.equalTo("text", requestJSON.message);

	// 	roomsQuery.find({
	// 		success: function(chats) {
	// 			var chatsJSON = chats.map(function(chat) { return chat.toJSON() });
	// 			var roomIds = chatsJSON.map(function(chat) { return chat.roomId });
	// 			var promises = [];
	// 			for (var i=0; i < roomIds.length; i++) {
	// 				var id = roomIds[i];
	// 				if (id) {
	// 					var responseQuery = new Parse.Query("Chat");
	// 					var helperId = id.substring(10,20);
	// 					responseQuery.equalTo("roomId", id);
	// 					responseQuery.equalTo("user", helperId);
	// 					promises.push(responseQuery.count());
	// 				}
	// 			}
	// 			Parse.Promise.when(promises).then(function() {
	// 				var numLiveRooms = 0;
	// 				for (var i=0; i < roomIds.length; i++) {
	// 					if (arguments[i] > 0) {
	// 						numLiveRooms += 1;
	// 					}
	// 				}
	// 				requestJSON.numLiveRooms = numLiveRooms;
	// 				return requestJSON;
	// 			});
	// 		}
	// 	});
	// }

});

router.get('/:requestId', function(req, res, next) {
	// first try to find the request: try QuickhelpRequests then QuickhelperRequests
	var requestId = req.params.requestId;

	var quickhelpRequestsQuery = new Parse.Query("QuickhelpRequests");
	var quickhelperRequestsQuery = new Parse.Query("QuickhelperRequests");

	quickhelpRequestsQuery.equalTo("objectId", requestId);
	quickhelperRequestsQuery.equalTo("objectId", requestId);

	var promises = [];

	promises.push(quickhelpRequestsQuery.first());
	promises.push(quickhelperRequestsQuery.first());

	Parse.Promise.when(promises).then(function(quickhelpRequest, quickhelperRequest) {
		if (quickhelpRequest) {
			getRooms(quickhelpRequest);
		} else if (quickhelperRequest) {
			getRooms(quickhelperRequest);
		} else {
			res.send("Not a valid request id");
		}
	});	

	function getRooms(request) {
		var requestJSON = request.toJSON();
		var roomsQuery = new Parse.Query("Chat");

		// NOTE: we currently get the messages with the same text that are created within 10000ms = 10s of creation due to timing differences in Parse
		var createDate = new Date(requestJSON.createdAt);
		roomsQuery.greaterThan("createdAt", createDate);
		var createDateBuffer = new Date(Date.parse(createDate) + 10000);
		roomsQuery.lessThan("createdAt", createDateBuffer);

		roomsQuery.limit(1000);
		roomsQuery.equalTo("text", requestJSON.message);

		roomsQuery.find({
			success: function(chats) {
				var chatsJSON = chats.map(function(chat) { return chat.toJSON() });
				var roomIds = chatsJSON.map(function(chat) { return chat.roomId });
				var promises = [];
				for (var i=0; i < roomIds.length; i++) {
					var id = roomIds[i];
					var responseQuery = new Parse.Query("Chat");
					var helperId = id.substring(10,20);
					responseQuery.equalTo("roomId", id);
					responseQuery.equalTo("user", helperId);
					promises.push(responseQuery.count());
				}
				Parse.Promise.when(promises).then(function() {
					var liveRoomIds = [];
					var staleRoomIds = [];
					for (var i=0; i < roomIds.length; i++) {
						if (arguments[i] > 0) {
							liveRoomIds.push(roomIds[i]);
						} else {
							staleRoomIds.push(roomIds[i]);
						}
					}
					res.render('chats', { liveRoomIds: liveRoomIds, staleRoomIds: staleRoomIds });
				});
			},
			error: function(err) {
				res.send(err);
			}
		});
	}
});

module.exports = router;