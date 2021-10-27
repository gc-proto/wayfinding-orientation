
// Especially for trigger Enquiries Service FAQ in new window
function OpenFAQnewWindow(url)
{
	if(document.getElementById("item9")){
		if(document.getElementById("item9").checked)
			window.open(url);
		else
			document.getElementById("forwardForm").submit();
	}
	else
		document.getElementById("forwardForm").submit();
}

//For displaying or hiding menu panels
//function HideThePanel(thePanel)
//{
//	var panel = document.getElementById(thePanel);
//	alert('visibility: ' + panel.style.visibility);
//	panel.style.visibility = 'hidden';
//	alert('display: ' + panel.style.display);
//	panel.style.display = 'none';
//}
//
//function ShowThePanel(thePanel)
//{
//	alert('thePanel: ' + thePanel);
//	var panel = document.getElementById(thePanel);
//	alert('visibility: ' + panel.style.visibility);
//	document.getElementById(thePanel).style.visibility = '';
//	document.getElementById(thePanel).style.display = '';
//}

//function Show(item)
//{
//	document.getElementById(item).style.visibility = 'visible';
//	document.getElementById(item).style.display = 'inline';
//}

//function Hide(item)
//{
//	document.getElementById(item).style.visibility = 'hidden';
//	document.getElementById(item).style.display = 'none';
//}

