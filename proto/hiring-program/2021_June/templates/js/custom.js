var startTime;

/**
* show the modal dialogue
* 
*/
$(document).on( "wb-ready.wb", function( event ) {
    showDialog();

});

/**
 * This functions opens the what's new pop-up, if available.
 */
function showDialog() {
    if( $("#wpDialog").length == 0 ) {
    	return;
    }
    $( document ).trigger( "open.wb-lbx", [
        [
            {
                src: "#wpDialog",
                type: "inline"
            }
        ],
        true
    ]);
};

$(function() { 
    
     startTime = Date.now();

    /**
	 * AJAX timeout
	 */
    $.ajaxSetup({
        timeout: 30000
    });
    
    installAjaxEventHandlers($(document));

});

function installAjaxEventHandlers(parent) {
	
	/**
	 * AJAX error message
	 */
	var ajaxid;
	var err1;
	var err2;
	var runTime;
	
	parent.find(".do-nothing-failure").on("ajax-failed.wb", function() {
		//do absolutely nothing on failure
    });
	
	parent.find(".silent-failure").on("ajax-failed.wb", function(event) {
		//grab unique ajax id, log the failure
		runTime = Math.floor((Date.now() - startTime) / 1000);
		ajaxid = $(this).attr("id");
		err1 = event.fetch.error;
		err2 = event.fetch.xhr.status;
		ajaxFailLog(ajaxid, err1, err2, runTime);
		$(this).replaceWith("<!-- ajax-fail -->");
    });

    parent.find(".noisy-failure").on("ajax-failed.wb", function(event) {
    	runTime = Math.floor((Date.now() - startTime) / 1000);
    	var msg = "Information unavailable at this time";
    	//grab unique ajax id, log the failure
    	ajaxid = $(this).attr("id");
    	err1 = event.fetch.error;
		err2 = event.fetch.xhr.status;
		if (err1 == "timeout") {
    		msg = msg + ".  Please try again later.";
    	}
		ajaxFailLog(ajaxid, err1, err2, runTime);
        if( $('html').attr('lang') == 'fr' ) {
        	msg = "Renseignements non disponibles en ce moment";
        	if (err1 == "timeout") {
        		msg = msg + ".  Veuillez essayez de nouveau plus tard.";
        	}
        }
        $(this).replaceWith("<!-- ajax-fail --><div class='ajax-fail alert alert-danger mrgn-lft-md'><p>" + msg + "</p></div>");
    });
    
    /**
     * Special handling required for Benefits and credits on the tab page. An AJAX call is invoked for the Benefits sub-app 
     * to return benefits and credits as individual wells.  If the AJAX call fails, we need to display an error message in a well.
     */
    parent.find(".benefits-failure").on("ajax-failed.wb", function(event) {
    	//grab unique ajax id, log the failure
    	runTime = Math.floor((Date.now() - startTime) / 1000);
		ajaxid = $(this).attr("id");
		err1 = event.fetch.error;
		err2 = event.fetch.xhr.status;
		ajaxFailLog(ajaxid, err1, err2, runTime);
    	var heading = "Child and family benefits";
    	var msg = "Information unavailable at this time";
    	if (err1 == "timeout") {
    		msg = msg + ".  Please try again later.";
    	}	
        if( $('html').attr('lang') == 'fr' ) {
        	heading = "Prestations pour enfants et familles";
        	msg = "Renseignements non disponibles en ce moment";
        	if (err1 == "timeout") {
        		msg = msg + ".  Veuillez essayez de nouveau plus tard.";
        	}
        }
        
        $(this).replaceWith("<!-- ajax-fail --><section class='well well-panelpage pull-left'><h2 class='mrgn-tp-0'>" + heading + "</h2><div class='alert alert-danger mrgn-lft-md'><p>" + msg + "</p></div></section>");
    });
      
    parent.find(".rrsp-failure").on("ajax-failed.wb", function(event) {
    	var msg = "RRSP information unavailable at this time";
    	//grab unique ajax id, log the failure
    	runTime = Math.floor((Date.now() - startTime) / 1000);
    	ajaxid = $(this).attr("id");
    	err1 = event.fetch.error;
		err2 = event.fetch.xhr.status;
		if (err1 == "timeout") {
    		msg = msg + ".  Please try again later.";
    	}
		ajaxFailLog(ajaxid, err1, err2, runTime);
        if( $('html').attr('lang') == 'fr' ) {
        	msg = "Les renseignements « REER » non disponibles en ce moment";
        	if (err1 == "timeout") {
        		msg = msg + ".  Veuillez essayez de nouveau plus tard.";
        	}
        }
        $(this).replaceWith("<!-- ajax-fail --><div class='ajax-fail alert alert-danger mrgn-lft-md'><p>" + msg + "</p></div>");
    });
    
    parent.find(".tfsa-failure").on("ajax-failed.wb", function(event) {
    	var msg = "TFSA information unavailable at this time";
    	//grab unique ajax id, log the failure
    	runTime = Math.floor((Date.now() - startTime) / 1000);
    	ajaxid = $(this).attr("id");
    	err1 = event.fetch.error;
		err2 = event.fetch.xhr.status;
		if (err1 == "timeout") {
    		msg = msg + ".  Please try again later.";
    	}
		ajaxFailLog(ajaxid, err1, err2, runTime);
        if( $('html').attr('lang') == 'fr' ) {
        	msg = "Les renseignements « CELI » non disponibles en ce moment";
        	if (err1 == "timeout") {
        		msg = msg + ".  Veuillez essayez de nouveau plus tard.";
        	}
        }
        $(this).replaceWith("<!-- ajax-fail --><div class='ajax-fail alert alert-danger mrgn-lft-md'><p>" + msg + "</p></div>");
    });
	/**
	 * Initialize lightbox/toggle plugin with every ajax content update, denote ajax call success
	 */
	   parent.find("[data-ajax-replace]").on("wb-contentupdated", function() {
	       $(".wb-lbx").trigger("wb-init.wb-lbx");
	       $(".wb-toggle").trigger("wb-init.wb-toggle");
	       $("summary").trigger("wb-init.wb-details");
	       $(this).append("<!-- ajax-success -->");
	   });
    
}

function ajaxFailLog( message1, message2, message3, message4 ) {
    
    $.ajax({
        type: "GET",
        url: "ajaxFail.action?msg1=" + message1 + "&msg2=" + message2 + "&msg3=" + message3 + "&msg4=" + message4,
        processData: false,
        dataType: "text"
    });
}

$(function() {

    $("*:checkbox[id^='clsGrntFrm_studentGrant_selectedStudentGrantOption']").change(function() {
        $this = $(this);
        if( $this.is(':checked') ) {
            var $checklistItems = $("*:checkbox[id^='clsGrntFrm_studentGrant_selectedStudentGrantOption']");
            if( $this.attr('id') == 'clsGrntFrm_studentGrant_selectedStudentGrantOption-' + $checklistItems.length ) {
                for( var i = 1; i < $checklistItems.length; i++ ) {
                    var cbname = '#clsGrntFrm_studentGrant_selectedStudentGrantOption-' + i;
                    $(cbname).prop('checked', false);
                } 
            } else {
                var cbname = '#clsGrntFrm_studentGrant_selectedStudentGrantOption-' + $checklistItems.length;
                $(cbname).prop('checked', false);
            }
        }
    });
});
    

$("[id^=clsGrntFrm]").submit(function() {
	
    var $this = $(this);
    if( $this.hasClass("submitted") ) {
        e.preventDefault();
    } else {
        $this.addClass("submitted");
        $this.find("button[type=submit]").attr("disabled", "true");
    }
});
