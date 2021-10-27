function gooto(url) {
	location.href=url;
}

function sinLevel() {
	if (document.getElementById('clientSIN').value == "0") {
		gooto("b-rb-rs-03_eng.html");}
	else if (document.getElementById('clientSIN').value >= "1") {
		gooto("b-rb-rs-02a_eng.html");}
	else {
		gooto("b-rb-rs-02-error_eng.html");}
}

