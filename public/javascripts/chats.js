$(document).ready(function() {

	$(".roomId").click(function() {
		var id = $(this).data("id");
		window.location = '/rooms/' + id;
	});

});