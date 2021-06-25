// Especially for trigger Enquiries Service FAQ in new window
function OpenFAQnewWindow(url)
{
    if(document.getElementById("forwardForm_selectedOptionmor09")){
        if(document.getElementById("forwardForm_selectedOptionmor09").checked)
            window.open(url);
        else
            document.getElementById("forwardForm").submit();
    }
    else
        document.getElementById("forwardForm").submit();
}


// The function should be removed, after Struts2 conversion
function disableAutoComplete()
{
    document.forms[0].setAttribute('autocomplete', 'off');
}

var mybaInitialized = false;

$(document).on( "wb-ready.wb", mybaInit );

// ask wet to notify us of timerpoke events in case we miss the ready event
$(document).on( "timerpoke.wb", mybaInit );

function mybaInit() {  
	
    enableMenuLinks('body');
    enableSelectionChangeListeners();
    
    if( $("#mmlightbox").length != 0 ) {
        $(document).trigger( "open.wb-lbx", 
            [
               [
                   {
                       src: "#mmlightbox",
                       type: "inline"
                   }
               ],
               true
        ]);
    }

    $( document ).unbind( "timerpoke.wb", mybaInit);
    
	// For PSL41771, Spring 2019 add unread mail number beside Mail link in sidemenu_group.jsp
	$( "#unreadCountBuffer" ).on( "wb-contentupdated", function( event, data ) {
	    $( "[data-mail]" ).html( $( "#unreadCountBuffer" ).html() );
	    return true;
	});
	//End
}


// New menu items are added to the dom when the links are
// moved between the side and hamburger menus as a result of 
// resize events, so we need to reinstall the listeners
// whenever a resize event occurs
$(document).on( wb.resizeEvents, function( event ) {
    enableMenuLinks('body');
});


/**
 * For each menu option hyperlink, install a click listener that 
 * overrides the default anchor behavior and instead populates 
 * and posts the menu selection form.
 */
function enableMenuLinks(ancestor) {
    
    // add click event handler to each application download link
    $(ancestor + ' [data-linkInfo]').each(function() {
        
        var $this = $(this);
        intialized = true;
        
        $this.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // trap doubleclicks on those links
            $("[data-linkInfo]").off('click');
            
            var s = $this.attr('data-linkInfo');
            var linkInfo = jQuery.parseJSON(s);

        	var url = "mnslct.action?" + 
            "menuId=" + linkInfo.menuId + 
            "&option=" + linkInfo.option;
            
            if( linkInfo.accountSelectId ) {
                url += "&selectedAccountNumber=" + $(linkInfo.accountSelectId).val(); 
            }else if( linkInfo.accountSelect){
            	url += "&selectedAccountNumber=" + linkInfo.accountSelect;
            }
            
            if( linkInfo.rmiAcct ){
                url += "&rmiAcct=" + linkInfo.rmiAcct;
            }                
            console.log("url="+url)
            location.assign(url);
        });
    });
}


/**
 * In the rep variant, add a selection change listener for each of
 * the account select elements.  If the selected program account number
 * changes, perform an ajax call to retrieve the list of menu options
 * the rep is authorized for on the new account.
 */
function enableSelectionChangeListeners() {
    // add click event handler to each application download link
    $('[data-rep-account-select]').each(function() {
        
        var $this = $(this);
        
        $this.on('change', function(e) {
            var menuId = $this.attr('data-rep-account-select');
            var sectionSelector = '#' + menuId + '_section';
            var section = $(sectionSelector);
            $.ajax({
                url: "ccntnbr.action",
                dataType: "html",
                cache: false,
                data: {
                    "menuId" : menuId,
                    "selectedAccountNumber" : $this.val()
                },
                beforeSend: function() {
                    section.addClass("opct-50");                   
                },
                success: function(data, textStatus, xhr) {
                    section.html(data);
                    enableMenuLinks(sectionSelector);
                },
                error: function(xhr, textStatus, error) {
                },
                complete: function(xhr, textStatus) {
                    section.removeClass("opct-50");
                }
            });

            
        });
    });
}

/**
 * AJAX Error Handling
 */

var startTime;

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
   /*parent.find(".benefits-failure").on("ajax-failed.wb", function(event) {
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
   });*/
     
   /*parent.find(".rrsp-failure").on("ajax-failed.wb", function(event) {
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
   });*/
   
   /*parent.find(".tfsa-failure").on("ajax-failed.wb", function(event) {
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
   });*/
	/**
	 * Initialize lightbox plugin with every ajax content update, denote ajax call success
	 */
	   parent.find("[data-ajax-replace]").on("wb-contentupdated", function() {
	       $(".wb-lbx").trigger("wb-init.wb-lbx");
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
