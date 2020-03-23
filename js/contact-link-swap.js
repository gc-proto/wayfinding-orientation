$(document).ready(function () {
	console.log("ready!");

	var linkSwap = document.querySelector('a[href="https://www.canada.ca/en/contact.html"]');
	if (linkSwap) {
		linkSwap.setAttribute('href', 'contact-us.html')
	}
	console.log("run");

});