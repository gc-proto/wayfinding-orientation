// JavaScript Document
function gooto(url) {
	location.href=url;
}

function caseLevel() {
	if (document.getElementById('caseNumber').value == "1") {
		gooto("ppcssd01_eng.html");}
	else if(document.getElementById('caseNumber').value == "2") {
		gooto("aut1sd02_eng.html");}
	else if(document.getElementById('caseNumber').value == "3") {
		gooto("bensd02_eng.html");}
	else if(document.getElementById('caseNumber').value == "4") {
		gooto("cppeisd02_eng.html");}
	else if(document.getElementById('caseNumber').value == "5") {
		gooto("ppcssd02_dtc_eng.html");}
	else if(document.getElementById('caseNumber').value == "6") {
		gooto("bensd02_eng.html");}
	else {
		window.alert("Enter 1 in the Case or Reference number text box for Processing Review Program submissions, 2 for Office Audit, 3 for Benefits, 4 for CPP/EI, 5 for Disability Tax Credit, or 6 for Validation & Compliance");}
}