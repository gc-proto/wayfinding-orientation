function validateElement(idLegend, idError, strErrorMsg, top) {
  elementTop = getOffsetTop(document.getElementById(idLegend))
  if (document.getElementById(idError) !=null) {
    $("#"+idError).removeClass('hidden');
  } else {
    $("#"+idLegend).append('<strong style="margin-top:10px;" class="error" id="'+idError+'"><span class="label label-danger" style="text-align: left; display:block;">'+strErrorMsg+'</span></strong>');
  }
  if (top[0] > elementTop) {
    top[0] = elementTop;
    top[1] = idLegend;
  }
  return top;
}

//Get top based on all parent elements, instead of just parent element
const getOffsetTop = element => {
  let offsetTop = 0;
  while(element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}
