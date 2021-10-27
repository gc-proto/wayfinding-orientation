/**
 * Main Javascript used in the View My Return (VMR) application
 */

function submit(formId, action) {
	document.getElementById(formId).action = action;
	document.getElementById(formId).submit();
}

function addField(formId, key, value) {
	var fieldId = "FID"+key;
	var field = document.getElementById(fieldId);
	var form = document.getElementById(formId);
	if (field && form.contains(field)) {
		field.value = value;
	} else {
	    var input = document.createElement('input');
	    input.type = 'hidden';
	    input.id = fieldId;
	    input.name = key;
	    input.value = value;
	    form.appendChild(input);
	}
}

function renderAssessment() {
	var elemId = document.getElementsByName("selectedAssessId")[0].value;
	addField("frmId", "selectedTabId", elemId);
	submit("frmId", "tbAsmnt.action");

}

function printViewReturn() {
	expandSections(true);
	window.print();
}


function goToSection(listObject) {
	selectedValue = listObject.options[listObject.selectedIndex].value;
	if (selectedValue != "none") {
		location.hash = selectedValue;
		listObject.selectedIndex = 0;
	}
}

function expandSections(/*boolean*/ expandAll) {
	var elements = document.getElementsByTagName("details");
	for (var i=0; i < elements.length; i++) {  
		if (elements[i].id != "") {
			if (expandAll) {
				elements[i].setAttribute("open", "open");
			} else {
				elements[i].removeAttribute("open");
			}
		}
	}
}