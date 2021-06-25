function submit(formId, action) {
	var form = document.getElementById(formId); 
	form.action = action;
	form.submit();
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

function hasClass(element, className) {
	var regEx = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');
    return element.className.match(regEx);
}

function addClass(element, className) {
    if (!hasClass(element, className)) {
    	element.className += " " + className;
    }
}

function removeClass(element, className) {
	var regEx = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');
    element.className = element.className.replace(regEx, ' ');
}

function gotoAnchor(id) {
	document.location.hash = id;
}

function hiliteInputField(element) {
	var cssHiliteClass = "hilite";
	var fieldNode = element.nodeName.toLowerCase();

	if (fieldNode == "input" || fieldNode == "select" || fieldNode == "textarea") {
		addClass(element, cssHiliteClass)
	}
}
function focusOnField(elementId, hilite) {
	/* if (getIEVersion() > 0) {
        return true;
    } */
    var field = document.getElementById(elementId);
    if (field != null && hilite) {
    	hiliteInputField(field);
    }
    gotoAnchor(elementId);
    if (field != null) {
    	field.focus();
    }
    return false;
}

function clickAcknowledgement(chkElement) {
	/* Blur and refocus on click so that onchange event is triggered. Necessary for some browsers. */
	chkElement.blur();
	chkElement.focus();
}
function checkAcknowledgement(chkElement, buttonId) {
	document.getElementById(buttonId).disabled = !chkElement.checked;
} 
function chgTb(selectedTabId) {
	addField("frmCmrT1General", "selectedTabId", selectedTabId);
	addField("frmCmrT1General", "clearNewlyAddedLines", true);
	submit("frmCmrT1General", "tbT1Gnrl.action");
}

function goToLine(lineId) {
	addField("frmCmrT1General", "searchLineId", lineId);
	submit("frmCmrT1General", "slctTxLnT1Gnrl.action");
}
function goToSchedule(scheduleId) {
	addField("frmCmrT1General", "scheduleId", scheduleId);
	submit("frmCmrT1General", "slctSchedT1Gnrl.action");
}

function hideDiv(id) {
	var btnDiv = document.getElementById(id);
	if (btnDiv != null){
		btnDiv.style.display="none";
	}
}

/* this is used to change the default action when the search and T1 general pages are displayed together*/  
function changeDefaultActionOnFocus(srching) {
	if (srching){
		document.getElementById("dfltSbmtId").name = 'action:srchTxLn';
	}
	else{
		document.getElementById("dfltSbmtId").name = 'action:svT1Gnrl';
	}
	return false;
}

//-->