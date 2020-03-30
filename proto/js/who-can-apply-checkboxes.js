// if you want the banner off, just comment out the file 

$(".action-checkbox").change(function(){
	if ($('.action-checkbox:checked').length == $('.action-checkbox').length) {
		$("#action-msg-all").removeClass("hidden-action").addClass("visible-action");
		$("#action-msg-notall").addClass("hidden-action").removeClass("visible-action");
	}
	if ($('.action-checkbox:checked').length !== $('.action-checkbox').length) {
		$("#action-msg-all").addClass("hidden-action").removeClass("visible-action");
		$("#action-msg-notall").removeClass("hidden-action").addClass("visible-action");
	}
})