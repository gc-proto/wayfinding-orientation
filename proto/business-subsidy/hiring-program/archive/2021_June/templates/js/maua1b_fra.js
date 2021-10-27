// JavaScript Document
function gooto(url) {
	location.href=url;
}

function caseLevel() {
	if (document.getElementById('caseNumber').value == "1") {
		gooto("ppcssd01_fra.html");}
	else if(document.getElementById('caseNumber').value == "2") {
		gooto("aut1sd02_fra.html");}
	else if(document.getElementById('caseNumber').value == "3") {
		gooto("bensd02_fra.html");}
	else if(document.getElementById('caseNumber').value == "4") {
		gooto("cppeisd02_fra.html");}
	else if(document.getElementById('caseNumber').value == "5") {
		gooto("ppcssd02_dtc_fra.html");}
	else if(document.getElementById('caseNumber').value == "6") {
		gooto("bensd02_fra.html");}
	else {
		window.alert("Entrez \u00AB 1 \u00BB dans la boite Num\u00E9ro de cas ou de r\u00E9f\u00E9rence pour les soumissions du Programme de revue du traitement, \u00AB 2 \u00BB pour V\u00E9rification au bureau, \u00AB 3 \u00BB pour les Programmes de l'admissibilit\u00E9 et la d\u00E9termination des prestations, \u00AB 4 \u00BB pour RPC/AE, \u00AB 5 \u00BB pour le cr\u00E9dit d'impot pour personnes handicap\u00E9es, ou \u00AB 6 \u00BB pour Validation et observation");}
}