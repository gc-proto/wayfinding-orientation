 
 //AMS Timeout
 
 
  
 
 var awsc ={}
 
 //need to encode the french message because some apps are using UTF-8 encoding instead of latin1.
 awsc.message1 = {
		 
		 "en": decodeURIComponent("Your%20session%20will%20expire%20automatically%20in%20<span id='timeout-min'>3</span>%20min%20<span id='timeout-sec'>0</span>%20sec.<br>Select%20%22Continue%20session%22%20to%20extend%20your%20session."),
		 "fr": decodeURIComponent("Votre%20session%20expirera%20automatiquement%20dans%20<span id='timeout-min'>3</span>%20min%20<span id='timeout-sec'>0</span>%20sec.<br>S%C3%A9lectionner%20%C2%AB%20Continuer%20la%20session%20%C2%BB%20pour%20prolonger%20votre%20session.")
 }
 
 awsc.message1Button1 = {
		 "en": decodeURIComponent("Continue%20session"),
		 "fr": decodeURIComponent("Continuer%20la%20session")
 }
 
 awsc.message1Button2 = {
		 "en": decodeURIComponent("End%20session%20now"),
		 "fr": decodeURIComponent("Mettre%20fin%20%C3%A0%20la%20session")
 }
 
 awsc.OKButton = {
		 "en": decodeURIComponent("Ok"),
		 "fr": decodeURIComponent("Ok")
 }
 
 awsc.message2 = {
		 
		 "en": decodeURIComponent("Application%20session%20has%20expired.%20Login%20may%20be%20required%20to%20continue."),
		 "fr": decodeURIComponent("La%20session%20de%20l'application%20a%20expir%C3%A9.%20Il%20se%20peut%20que%20vous%20ayez%20%C3%A0%20ouvrir%20une%20autre%20session%20pour%20continuer.")
 }
 
 awsc.timeoutTitle = {
		 "en": decodeURIComponent("Session%20timeout%20warning"),
		 "fr": decodeURIComponent("Avertissement%20d'expiration%20de%20la%20session") 
 } 
 awsc.util = {
	
    getLanguage : function () {                                                                                   
	    var language = awsc.util.getCookie('cra-pref');                                                                             
	                                                                               
	    return language;                                                                                                
	},

	                                                                                                                 
 	getCookie: function (name) {                                                                                        
	    var arg = name + '=';                                                                                           
	    var alen = arg.length;                                                                                          
	    var clen = top.document.cookie.length;                                                                          
	    var i = 0;                                                                                                      
	    while (i < clen) {                                                                                              
	      var j = i + alen;                                                                                             
	      if (top.document.cookie.substring(i, j) == arg)                                                               
	          return awsc.util.getCookieVal (j);                                                                                    
	      i = top.document.cookie.indexOf(' ', i) + 1;                                                                  
	      if (i == 0) break;                                                                                            
	    }                                                                                                               
	    return null;                                                                                                    
	},

 	getCookieVal: function (offset) {                                                                                  
	    var endstr = top.document.cookie.indexOf (';', offset);                                                       
	    if (endstr == -1)                                                                                               
	        endstr = top.document.cookie.length;                                                                        
	    return top.document.cookie.substring(offset, endstr);                                                           
	}
 }
 
 awsc.timeout = 60*1000*18;
 awsc.warningTimeout = 1000*60*3
 awsc.link = document.createElement('link');
 awsc.style = document.getElementsByTagName('head')[0];
 awsc.link.rel = 'stylesheet';
 awsc.link.href = '/gol-ged/awsc/amss/pub/css/timeout.css';
 awsc.style.parentNode.appendChild(awsc.link, awsc.style);
 awsc.timeoutPath = "/gol-ged/awsc/amss/enrol/timeout";
 awsc.logoutPath = "/gol-ged/awsc/amss/enrol/logout/default"
 
 var contextPath = document.location.pathname.match(/\/gol-ged\/[^/]*\/[^/]*\//);
 
 if (contextPath[0]){
 
 	if (document.location.pathname.match(/\/gol-ged\/awsc\/amss\/enrol\/qa\/[^/]*/)){
 	
 		//QuickAccess for MyA set timeout to 10 mins
 		awsc.timeout = 60*1000*10;
 		awsc.pingPath = "/gol-ged/awsc/amss/enrol/qa/nopath";
 		awsc.timeoutPath = "/gol-ged/awsc/amss/enrol/qa/timeout";
 	}
 	else if (document.location.pathname.match(/\/gol-ged\/awsc\/amss\/enrol\/qabro\/[^/]*/)){
 	
 		//QuickAccess for BRO set timeout to 10 mins
 		awsc.timeout = 60*1000*10;
 		awsc.pingPath = "/gol-ged/awsc/amss/enrol/qabro/nopath";
 		awsc.timeoutPath = "/gol-ged/awsc/amss/enrol/qabro/timeout"
 	}
 	else if (document.location.pathname.match(/\/gol-ged\/awsc\/amss\/enrol\/[^/]*/)){
 	
 		awsc.pingPath = "/gol-ged/awsc/amss/enrol/nopath";
 	}
 	else if (contextPath[0].match(/\/gol-ged\/miba\/qckccss\//)){
 	
 		//MyA QuickAccess set timeout to 10 mins
 		awsc.timeout = 60*1000*10;
 		awsc.pingPath = contextPath[0] + "prot/nopath";
 	
 	}
 	else if (contextPath[0].match(/\/gol-ged\/brom\/bro\/[^/]*/)){
 	 	
 		//QuickAccess for BRO set timeout to 10 mins
 		awsc.timeout = 60*1000*10;
 		awsc.pingPath = "/gol-ged/awsc/amss/enrol/qabro/nopath";
 		awsc.timeoutPath = "/gol-ged/awsc/amss/enrol/qabro/timeout";
 	
 	}
 	else if (document.location.pathname.match(/\/gol-ged\/mima\/myccnt\/[^/]*/)){
 	 	
 		awsc.pingPath = contextPath[0] + "prot/nopath";
 	}
 	else if (document.location.pathname.match(/\/gol-ged\/pzaz\/tppm\/[^/]*/)){
 	 	
 		awsc.pingPath = contextPath[0] + "prot/nopath";
 	}
 	else if (document.location.pathname.match(/\/gol-ged\/mbsl\/myba\/[^/]*/)){
 	 	
 		awsc.pingPath = contextPath[0] + "prot/nopath";
 	}
 	else if (document.location.pathname.match(/\/gol-ged\/mmbb\/mba\/[^/]*/)){
 	 	
 		awsc.pingPath = contextPath[0] + "prot/nopath";
 	}
 	else
 	{
 		awsc.pingPath = contextPath[0] + "prot/nopath";
	}
	
	
  	
 }
 
 
 awsc.warningTimer = {
		 
	minutes:3,
	seconds:0,
				 
 	countDown:60,
 	expired:false,
 	countdownInterval:null,
		 
 	extendSession:function(){
		clearInterval( awsc.warningTimer.countdownInterval );
 		awsc.warningTimer.ping();
 		awsc.endTime = new Date().getTime() + awsc.timeout;
		window.setTimeout(awsc.warningTimer.displayPopup,awsc.timeout - awsc.warningTimeout);
		
		document.getElementById("wb-sessto-modal").style.visibility = 'hidden';
		
		awsc.warningTimer.minutes = 3;
		awsc.warningTimer.seconds = 0;
		document.getElementById("timeout-min").innerHTML = 3;
		document.getElementById("timeout-sec").innerHTML = 0 ;
	 },
		 
 	ping: function(){
		        
	     if (window.XMLHttpRequest) {
			 this.req = new XMLHttpRequest();
			 this.req.onreadystatechange = function(){ 
					 
				 awsc.warningTimer.processReqChange.call(awsc.warningTimer);
			 };
			 this.req.open("GET", awsc.pingPath, true);
			 this.req.send(null);

		     } else if (window.ActiveXObject) {
		    	 this.req = new ActiveXObject("Microsoft.XMLHTTP");
		    	 if (this.req) {
		    		 this.req.onreadystatechange = function(){ 	 
		    			 awsc.warningTimer.processReqChange.call(awsc.warningTimer);
		    		 };
		    		 this.req.open("GET", awsc.pingPath, true);
				 	this.req.send();
		    	 }
		     	}		
	},
		 
	 processReqChange:function(){		 

	     if (this.req.readyState == 4) {

			 if (this.req.status != 200) {
						
			 }
	     }
	 },
			 
	 logout:function(){
		 document.location = awsc.logoutPath;
	 },
			 
	 timedout:function(){
		 document.location = "/gol-ged/awsc/amss/enrol/logout/cra-main";
	 },
			 			 
	 initialize:function(){
		 var modalID = "#wb-sessto-modal",child, modal, temp;
		 var modalExists = document.getElementById("wb-sessto-modal");
				 
		 var time = awsc.warningTimer.getTime( awsc.warningTimeout ),
			timeoutBegin = awsc.message1[awsc.util.getLanguage()];
				 
	 	if (!modalExists) 
	 	{
			modal = document.createDocumentFragment();
			temp = document.createElement( "div" );
			
						
			temp.innerHTML = "<a class='wb-lbx lbx-modal mfp-hide' href='#wb-sessto-modal'></a>" +
				"<section id='wb-sessto-modal' style='visibility:hidden' class='mfp-hide modal-dialog modal-content overlay-def'>" +
				"<header class='modal-header'><h2 class='modal-title'>" + awsc.timeoutTitle[awsc.util.getLanguage()] + "</h2></header>" +
				"<div class='modal-body' id='modal-body'> <p>" + timeoutBegin + "</p></div>" +
				"<div class='modal-footer' id='modal-footer'><button type='button' class='btn btn-primary popup-modal-dismiss' onClick='awsc.warningTimer.extendSession()' >" + 
				awsc.message1Button1[awsc.util.getLanguage()] + "</button> <button type='button' class='btn btn-default' onClick='awsc.warningTimer.logout()'>" + 
				awsc.message1Button2[awsc.util.getLanguage()] + "</button> </div> </section>";
						
				// Get the temporary <div>'s top level children and append to the fragment
				while ( ( child = temp.firstChild ) !== null ) {
					modal.appendChild( child );
				}
			document.body.appendChild( modal );
		}
	},
			 
	displayPopup:function(){
		 
		var modalID = "#wb-sessto-modal",child, modal, temp;
		 		 
		 var body = document.getElementsByTagName('body')[0];
		 var modalExists = document.getElementById("wb-sessto-modal");

		 window.setTimeout(function(){
		 wb.doc.trigger( "open.wb-lbx", [[{src: "#wb-sessto-modal",type: "inline"}],true]); 
					 
		 modalExists.style.visibility = 'visible';
		 awsc.warningTimer.minutes = 3,
		 awsc.warningTimer.seconds = 0;
					 
		 awsc.warningTimer.countdownInterval = setInterval( function() {
			 if ( awsc.warningTimer.countdown( ) ) {
				 clearInterval( awsc.warningTimer.countdownInterval );

				 // Let the user know their session has timed out
				 document.getElementById("modal-body").innerHTML = "<p>" + awsc.message2[awsc.util.getLanguage()] + "</p>";
				 document.getElementById("modal-footer").innerHTML = "<button type='button' class='btn btn-primary' onClick='awsc.warningTimer.timedout()' >" + 
				 awsc.OKButton[awsc.util.getLanguage()] + "</button>";					
			 }
		}, 1000 );
	 },1000); 
			
	},

	/**
	 * Converts a millisecond value into minutes and seconds
	 * @function getTime
	 * @param {integer} milliseconds The time value in milliseconds
	 * @returns {Object} An object with a seconds and minutes property
	 */
	getTime:function( milliseconds ) {
		var time = { minutes: "", seconds: "" };
		if ( milliseconds != null ) { //eslint-disable-line no-eq-null
			time.minutes = parseInt( ( milliseconds / ( 1000 * 60 ) ) % 60, 10 );
			time.seconds = parseInt( ( milliseconds / 1000 ) % 60, 10 );
		}
		return time;
	},

	/**
	 * Given 2 elements representing minutes and seconds, decrement their time value by 1 second
	 * @function countdown
	 * @param {jQuery DOM Element} $minutes Element that contains the minute value
	 * @param {jQuery DOM Element} $seconds Element that contains the second value
	 * @returns {boolean} Is the countdown finished?
	 */
	countdown:function( ) {
		var minutes = parseInt( awsc.warningTimer.minutes, 10 ),
		seconds = parseInt( awsc.warningTimer.seconds, 10 );

		// Decrement seconds and minutes
		if ( seconds > 0 ) {
			seconds -= 1;
		} else if ( minutes > 0 ) {
			minutes -= 1;
			seconds = 59;
		}

		awsc.warningTimer.minutes = minutes;
		awsc.warningTimer.seconds = seconds;
					
		document.getElementById("timeout-min").innerHTML = minutes;
		document.getElementById("timeout-sec").innerHTML = seconds ;

		return minutes === 0 && seconds === 0;
	}
}
		 
		 
 awsc.warningTimer.initialize();
 window.setTimeout(awsc.warningTimer.displayPopup,awsc.timeout - awsc.warningTimeout);
 awsc.endTime = new Date().getTime() + awsc.timeout;