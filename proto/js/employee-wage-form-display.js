//display specific employee work hours panel based on pay schedule
$("#py-schl").on("change", function (event) {
  var target = event.target;
  $("#employees").removeClass('hidden');
  $("#sendTo").removeClass('hidden');
  //user chose weekly pay schedule
  if (target.value == "1") {
    $("#wkly-emp-1").removeClass('hidden');
    $("#bwkly-emp-1").addClass('hidden');
  //user chose bi-weekly schedule
  } else if(target.value == "2") {
    $("#bwkly-emp-1").removeClass('hidden');
    $("#wkly-emp-1").addClass('hidden');
  //default index selected
  } else {
    $("#employees").addClass('hidden');
    $("#sendTo").addClass('hidden');
    $("#wkly-emp-1").addClass('hidden');
    $("#bwkly-emp-1").addClass('hidden');
  }
  target.parentElement.scrollIntoView(true);
});