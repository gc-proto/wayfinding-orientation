function gooto(url) {
	location.href=url;
}

function sinLevel() {
	if (document.getElementById('clientSIN').value == "0") {
		gooto("b-rb-rs-03_fra.html");}
	else if (document.getElementById('clientSIN').value >= "1") {
		gooto("b-rb-rs-02a_fra.html");}
	else {
		gooto("b-rb-rs-02-error_fra.html");}
}

