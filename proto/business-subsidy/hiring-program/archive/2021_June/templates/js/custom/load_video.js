/*  Helper class for loading videos
*/

/**
 * @name :load_video
 * @author : Government of Canada 
 */
		function getInfo(){	
			if($(this).GetURLParam('foo')=='bar'){
			var err1=myVid.error!==null ? myVid.error.code : "false";
			var err2=myVid.canPlayType("video/webm");
			var err3=myVid.canPlayType("video/mp4");
			var err4=myVid.src;
			var err4b=myVid.currentSrc;
			var err5=myVid.networkState;
			var message = "<ul><li>error = "+err1+"</li><li>Canplay webm = "+err2+"</li><li>Canplay mp4 = "+err3+"</li><li>Current source = "+err4+"</li><li>currentSrc = "+err4b+"</li><li>networkState = "+err5+"</li></ul><button onClick='getInfo()'>Reload</button>";	
			var elements = $('div.wet-boew-multimedia.span-4');
			$(elements.get(0)).append(message);
			}	
		}

$.fn.GetURLParam = function(param)
{
    var url = window.location.search.substring(1);  
	
	var urlVars = url.split('&');  
	for (var i = 0; i < urlVars.length; i++)   
	{  
		var paramName = urlVars[i].split('='); 
		if (paramName[0] == param)   
		{  
			return paramName[1];  
			
		} 
	} 
return false;	
}

// there are many error catching mechanisms hat can be removed once we are sure there is webm present for all .mp4 files.
 $(document).ready( function(){			
	var clp = $(this).GetURLParam('clp');
	var $myVid=$("video");
	var $myTrack=$("track");
	var $myWebm=$("source").first();
	var $mymp4=$("source").last();
	
	if(clp!=false){
		$myVid.attr('poster','/vdgllry/'+clp+'.jpg');
		$myTrack.attr('src','/vdgllry/'+clp+'.xml');
		$myWebm.attr('src','/vc/'+clp+'.webm');
		$mymp4.attr('src','/vc/'+clp+'.mp4');
		
		//reload the video with new parameters
	 try{
		
		$myVid.load();
	 }catch(err){
	 //catch error thrown by non HTML5 browsers but don't do anything
		alert(err);
	 }
	}
			
	//getInfo();
		
});
