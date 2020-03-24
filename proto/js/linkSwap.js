$(document).ready(function () {
    "use strict";
    var contactPage = {
        en: "./contact-us.html",
        fr: "./contactez-nous.html"
    };
    var lang = $("html").attr("lang");
    var contactLinks = Array.from($("a[href$='canada.ca/en/contact.html']"));

    function LinkSwap(currentValue) {
        $(currentValue).attr("href", contactPage[lang]);
    }

    contactLinks.forEach(LinkSwap);
});