$(document).ready(function () {
	console.log("ready!");

	var linkSwap = document.querySelector('a[href="https://www.canada.ca/en/contact.html"]');
	if (linkSwap) {
		linkSwap.setAttribute('href', 'http://test.canada.ca/covid-19-guidance/proto/0_archive-of-prev-content/cerb23-03-2020/cerb-cra/contact.html')
	}
	console.log("run");

});