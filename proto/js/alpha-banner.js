// if you want the banner off, just comment out the file 

console.log("banner-start");

	var alphaBanner = document.getElementsByTagName('BODY')[0];
	alphaBanner.insertAdjacentHTML('afterbegin', '<section class="experimental alpha-top"><h2 class="wb-inv">Alpha</h2><div class="container"><small><label class="alpha-label">Alpha</label>&nbsp;&nbsp; This is an experimental version of Canada.ca for public testing.</small></div></section >');
console.log("banner-end");
