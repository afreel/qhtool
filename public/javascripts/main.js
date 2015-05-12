$(document).ready(function() {

	$(".tutor_popup").popup({
		// on closing the popup, remove all the information
		onclose: function() {
			// $('#about-tab-link').removeClass('popup-active-tab');
			// $('#reviews-tab-link').removeClass('popup-active-tab');
			// Clear existing containers
			$("#tutorTitleSection img").empty();
			$("#tutorTitleSection div").empty();
			$("#tutorDetailsSection div div").empty();
			// $("#reviewsContainer").empty();
		}
	});

	// initially hide the popup
	$(".tutor_popup").popup('hide');
	// initialize the popup tabs
	//$( "#tabs" ).tabs();

	// triggered when clicking a tutor's display card
	$(".tutorCard").click(function() {
		var userId = $(this).data('userid');
		var userLat = $(this).data('userlat');
		var userLon = $(this).data('userlon');
		var subject = $(this).data('subject');
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "users?id=" + userId + '&lat=' + userLat + '&lon=' + userLon,
			success: function(data) {
				var user = data.content.user;

				// Ensure that the About Tab is activated and underlined first
				// $( "#tabs" ).tabs({ active: 0 });
				// $('#about-tab-link').addClass('popup-active-tab');

				// Picture
				$("#tutorCirclePic").attr('src', user.picture.url);

				// Name
				$("#tutorName").text(user.displayName);

				// Ratings Calculations
				// var writtenReviews = [];
				var reviews = user.reviews;
				if (reviews.length > 0) {
					var numReviews = reviews.length; // number of reviews
					var ratingTotal = 0; // non-normalized rating
					for (var i = 0; i < numReviews; i++) {
						// get reviews that have written feedback for display
						// if (reviews[i].Review) {
						// 	if (reviews[i].Reviewer === "QuickHelp") {
						// 		writtenReviews.unshift([reviews[i].Rating, reviews[i].createdAt, reviews[i].Review, reviews[i].Reviewer]);
						// 	} else {
						// 		writtenReviews.push([reviews[i].Rating, reviews[i].createdAt, reviews[i].Review, reviews[i].Reviewer]);
						// 	}
						// }
						// aggregate ratings to compute average
						if (reviews[i].Rating) {
							ratingTotal += reviews[i].Rating;
						} else {
							ratingTotal += 0; // if no rating, it is considered a 0
						}
					}
					if (numReviews > 0) {
						var normalizedRating = (ratingTotal / numReviews).toFixed(1);
						$("#tutorRating").text("Rating: " + normalizedRating + " with " + numReviews + " ratings");
					} else {
						$("#tutorRating").text("No rating yet");
					}
				// if no reviews, then no ratings
				} else {
					$("#tutorRating").text("No rating yet");
				}
				var rate = (user.Rate / 4).toFixed(2);
				$("#tutorRate").text(rate);

				// Distance Away
				if (user.distanceAway) {
					$("#tutorDistanceAway").show();
					$("#tutorDistanceAway").text(getReadableDistance(user.distanceAway));
				} else {
					$("#tutorDistanceAway").hide();
				}

				// Details Section - only show field if defined
				if (user.education) {
					$("educationSection").show();
					$("#educationSection div").text(user.education);
				} else {
					$("educationSection").hide();
				}

				// Show subject-specific qualifications
				if (user.hasOwnProperty(subject)) {
					$("#subjectDetailsSection").show();
					$("#subjectDetailsSection h3").text("Some topics I can help with in " + insertSpaces(subject));
					$("#subjectDetailsSection div").text(user[subject]);
				} else {
					$("#subjectDetailsSection").hide();
				}

				if (user.tutoringPhilosophy) {
					$("#tutoringPhilosophySection").show();
					$("#tutoringPhilosophySection div").text(user.tutoringPhilosophy);
				} else {
					$("#tutoringPhilosophySection").hide();
				}

				if (user.generalQualifications) {
					$("#generalQualificationsSection").show();
					$("#generalQualificationsSection div").text(user.generalQualifications);
				} else {
					$("#generalQualificationsSection").hide();
				}

				if (user.specialQualifications) {
					$("#specialQualificationsSection").show();
					$("#specialQualificationsSection div").text(user.specialQualifications);
				} else {
					$("#specialQualificationsSection").hide();
				}

				if (user.favoriteThings) {
					$("#favoriteThingsSection").show();
					$("#favoriteThingsSection div").text(user.favoriteThings);
				} else {
					$("#favoriteThingsSection").hide();
				}

				if (user.availabilityPreferences) {
					$("#availabilitySection").show();
					$("#availabilitySection div").text(user.availabilityPreferences);
				} else {
					$("#availabilitySection").hide();
				}

				// WRITTEN REVIEWS NOT CURRENTLY SUPPORTED
				// if (writtenReviews.length == 0) {
				// 	$("#reviewsContainer").append("<div>No Written Reviews Yet</div>");
				// } else {
				// 	// writtenReviews[i] = [Rating, createdAt, Review, Reviewer]
				// 	for (var i=0; i < writtenReviews.length; i++) {
				// 		// TODO: use a partial instead and pass it the review
				// 		$("#reviewsContainer").append("<div>"+writtenReviews[i][2]+"</div>");
				// 	}
				// }

				// show popup and scroll to the top
				$(".tutor_popup").popup('show');
				$(".tutor_popup").scrollTop(0);
			}
		});
	});

	$('.tutor_popup_close').click(function() {
		$(".tutor_popup").popup('hide');
	});

	// Popup Tab Click
	// $('.popup-tab-list-item').click(function() {
	// 	var activeTab = $(".popup-tab-list-item.ui-state-active").index();
	// 	// 0 is About Tab, 1 is Reviews Tab
	// 	if (activeTab == 0) {
	// 		$('#about-tab-link').addClass('popup-active-tab');
	// 		$('#reviews-tab-link').removeClass('popup-active-tab');
	// 	} else if (activeTab == 1) {
	// 		$('#about-tab-link').removeClass('popup-active-tab');
	// 		$('#reviews-tab-link').addClass('popup-active-tab');
	// 	}
	// });

	// $(".subjectTitleLink").click(function() {
	// 	var subject = $(this).parent().data('subject');
	// 	window.location = 'subjects?name=' + subject;
	// });

	// $(".viewMore").click(function() {
	// 	var subject = $(this).parent().data('subject');
	// 	window.location = 'subjects?name=' + subject;
	// });

	// $(".goBack").click(function() {
	// 	window.location = '/';
	// });

	function insertUnderscores(name) {
		return name.split(' ').join('_');
	}

	function insertSpaces(name) {
		return name.split('_').join(' ');
	}

	// turn miles into nicely displayable string
	function getReadableDistance(miles) {
		milesFloor = Math.floor(miles);
		if (milesFloor < 1) {
			return "Less than a mile away";
		} else if (milesFloor == 1) {
			return "A mile away";
		} else {
			return milesFloor.toString() + " miles away"
		}
	}

});