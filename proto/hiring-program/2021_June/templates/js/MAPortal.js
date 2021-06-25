
/**
 * Disable the Logout button on first click. Any click after will not
 * fire an event.
 */

$(document).ready(function(){
	$('#logout-btn').click(function(){
		$(this).attr('disabled','disabled');
		$(this).attr('aria-disabled','true');
		$(this).addClass("disabled");

		$(this).click(function(e){
			event.preventDefault();
		});
	});
});