/**
 * The javascript file for MyBA template only
 */

// disable logout button after 1st time click
$('#logout-btn').click(function(){

    $(this).attr('disabled','disabled');
    $(this).attr('aria-disabled','true');
    $(this).addClass("disabled");

    $(this).click(function(e){
    	event.preventDefault();
});



});