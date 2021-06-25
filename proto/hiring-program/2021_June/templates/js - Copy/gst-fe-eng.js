// JavaScript Document
function gooto(url) {
	location.href=url;
}

function caseLevel() {
	if (document.getElementById('caseNumber').value == "1") {
		gooto("../gst-hst/file-election/b-rt-fe-12_revoke_eng.html");}
	else if(document.getElementById('caseNumber').value == "2") {
		gooto("../gst-hst/file-election/b-rt-fe-12_elect_eng.html");}
		else {
		window.alert("Please make a selection");}
}
