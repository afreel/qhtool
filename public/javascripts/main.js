$(document).ready(function() {

	$("#tutorPopup").popup();
	$("#tutorPopup").popup('hide');

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

				// Details Section
				$("#educationSection div").text(user.education);

				// Show subject-specific qualifications
				if (user.hasOwnProperty(subject)) {
					$("#subjectDetailsSection").show();
					$("#subjectDetailsSection h3").text("Some topics I can help with in " + insertSpaces(subject));
					$("#subjectDetailsSection div").text(user[subject]);
				} else {
					$("#subjectDetailsSection").hide();
				}

				$("#tutoringPhilosophySection div").text(user.tutoringPhilosophy);
				$("#generalQualificationsSection div").text(user.generalQualifications);
				$("#specialQualificationsSection div").text(user.specialQualifications);
				$("#favoriteThingsSection div").text(user.favoriteThings);
				$("#availabilitySection div").text(user.availabilityPreferences);

				$("#tutorPopup").popup('show');
			}
		});
	});

	$(".subjectTitle").click(function() {
		var title = $(this).text();
		var query = insertUnderscores(title);
		window.location = 'subjects?name=' + query;
	});

	function insertUnderscores(name) {
		return name.split(' ').join('_');
	}

	function insertSpaces(name) {
		return name.split('_').join(' ');
	}

});