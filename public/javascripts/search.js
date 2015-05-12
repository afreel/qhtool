$(document).ready(function() {

	// populate subject dropdown 
	var subjects = ['Biology', 'Chemistry', 'Computer_Science', 'Economics', 'Engineering', 'Finance/Accounting', 'Interview_Practice', 'Job_Search/Prep', 'Language_Practice', 'Math', 'Paper/Essay/Proofreading', 'Physics', 'Psychology', 'Standardized_Test_Prep', 'Statistics', 'Other_Academics', 'Borrowing/Renting', 'Cleaning', 'Companionship', 'Delivery', 'Event_Organizing', 'Moving/Assembling/Fixing', 'Personal_Advice', 'Shopping_Assistant', 'Sports/Fitness/Workout', 'Other_Services'];
	for (var i = 0; i < subjects.length; i++) {
    var subj = subjects[i];
    var el = document.createElement("option");
    el.textContent = subj;
    el.value = subj;
    $('#selectSubject').append(el);
  }
  var selected = $('#selectSubject').data('subject');
  console.log(selected);
  $('#selectSubject').val(selected);

	$("#searchButton").click(function() {
		var subject = $('#selectSubject').val();
		var lat = $('#latInput').val();
		var lon = $('#lonInput').val();
		var radius = $('#radiusInput').val();
		window.location = '?subject=' + subject + '&lat=' + lat + '&lon=' + lon + '&radius=' + radius;
	});

});