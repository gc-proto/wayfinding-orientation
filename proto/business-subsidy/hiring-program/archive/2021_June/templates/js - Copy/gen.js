function externalLinks() { 
 if (!document.getElementsByTagName) return; 
 var anchors = document.getElementsByTagName("a"); 
 for (var i=0; i<anchors.length; i++) { 
   var anchor = anchors[i]; 
   if (anchor.getAttribute("href") && 
       anchor.getAttribute("rel") == "external") 
     anchor.target = "helpWindow"; 
 } 
} 
window.onload = externalLinks;




function createRefer(url, exitKey)
{
		var form = document.createElement("form");
		form.action = url;
		form.method = "get";
		
		var hiddenField = document.createElement("input");
		hiddenField.type = "hidden";
		hiddenField.name = "linkKey";
		hiddenField.value = exitKey;
		
		form.appendChild(hiddenField);
		
		document.getElementsByTagName("body")[0].appendChild(form);
		form.submit();
}
