$(document).ready(function() {

	$(".request").click(function() {
		var id = $(this).data("id");
		window.location = window.location + '/' + id;
	});

});