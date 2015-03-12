$(document).ready(function() {

	$(".tutor_popup").popup();
	$(".tutor_popup").popup('hide');
	$( "#tabs" ).tabs();
	// Ensure that the About Tab is activated first
	$('#about-tab-link').addClass('popup-active-tab');

	$(".tutorCard").click(function() {
		var userId = $(this).data('userid');
		var subject = $(this).data('subject');
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "users?id=" + userId,
			success: function(data) {
				var user = data.content.user;
				console.log(user);

				// Picture
				$("#tutorCirclePic").attr('src', user.picture.url);

				// Name
				$("#tutorName").text(user.displayName);

				// Ratings Calculations
				var reviews = user.reviews;
				if (reviews.length > 0) {
					var numReviews = reviews.length; // number of reviews
					var ratingTotal = 0; // non-normalized rating
					var countedRatings = 0; // number of ratings
					for (var i = 0; i < numReviews; i++) {
						// only count reviews that actually included ratings
						if (reviews[0].Rating) {
							ratingTotal += reviews[0].Rating;
							countedRatings += 1;
						}
					}
					if (countedRatings > 0) {
						var normalizedRating = (ratingTotal / countedRatings).toFixed(1);
						$("#tutorRating").text("Rating: " + normalizedRating + " with " + countedRatings + " ratings");
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

				$(".tutor_popup").popup('show');
				$(".tutor_popup").scrollTop(0);
			}
		});
	});

	$('.tutor_popup_close').click(function() {
		$(".tutor_popup").popup('hide');
	});

	// Popup Tab Click
	$('.popup-tab-list-item').click(function() {
		var activeTab = $(".popup-tab-list-item.ui-state-active").index();
		// 0 is About Tab, 1 is Reviews Tab
		if (activeTab == 0) {
			$('#about-tab-link').addClass('popup-active-tab');
			$('#reviews-tab-link').removeClass('popup-active-tab');
		} else if (activeTab == 1) {
			$('#about-tab-link').removeClass('popup-active-tab');
			$('#reviews-tab-link').addClass('popup-active-tab');
		}
	});

	$(".subjectTitleLink").click(function() {
		var subject = $(this).parent().data('subject');
		window.location = 'subjects?name=' + subject;
	});

	$(".viewMore").click(function() {
		var subject = $(this).parent().data('subject');
		window.location = 'subjects?name=' + subject;
	});

	$(".goBack").click(function() {
		window.location = '/';
	});

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