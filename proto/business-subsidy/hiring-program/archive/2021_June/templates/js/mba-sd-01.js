// JavaScript Document
function gooto(url) {
	location.href=url;
}

function caseLevel() {
	if (document.getElementById('caseNumber').value == "1") {
		gooto("../submit-docs/B-AURT-SD-02_eng.html");}
	else if(document.getElementById('caseNumber').value == "2") {
		gooto("../submit-docs/B-RT-SD-02_eng.html");}
	else if(document.getElementById('caseNumber').value == "3") {
		gooto("../submit-docs/B-RC-SD-02_eng.html");}
	else if(document.getElementById('caseNumber').value == "4") {
		gooto("../submit-docs/B-CPPEI-SD-02_eng.html");}

	else {
		window.alert("Enter 1 in the Case/reference number text box for GST/HST Audit, 2 for GST/HST Returns/Rebates/My BA Enquiries, 3 for T2 Corporation Assessing Review Program (RC accounts) or 4 for CPP/EI Rulings)");}
}