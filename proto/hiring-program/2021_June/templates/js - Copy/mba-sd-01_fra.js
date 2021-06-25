// JavaScript Document
function gooto(url) {
	location.href=url;
}

function caseLevel() {
	if (document.getElementById('caseNumber').value == "1") {
		gooto("../submit-docs/B-AURT-SD-02_fra.html");}
	else if(document.getElementById('caseNumber').value == "2") {
		gooto("../submit-docs/B-RT-SD-02_fra.html");}
	else if(document.getElementById('caseNumber').value == "3") {
		gooto("../submit-docs/B-RC-SD-02_fra.html");}
	else if(document.getElementById('caseNumber').value == "4") {
		gooto("../submit-docs/B-CPPEI-SD-02_fra.html");}

	else {
		window.alert("Entrez 1 dans la boite Numero de cas ou de reference pour la Verification de la TPS/TVH, 2 pour les Declarations de la TPS/TVH/remboursements/Service de demandes de renseignements de Mon dossier d'entreprise, 3 pour le Programme de revue des cotisations des societes T2 (comptes RC), ou 4 les Decisions RPC/AE");}
}