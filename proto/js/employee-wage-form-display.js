//display specific employee work hours panel based on pay schedule
$("#py-schl").on("change", function (event) {
  var target = event.target;
  //user chose weekly pay schedule
  if (target.value == "1") {
    $("#emp1").removeClass('hidden');
    $("#emp2").addClass('hidden');
  //user chose bi-weekly schedule
  } else if(target.value == "2") {
    $("#emp2").removeClass('hidden');
    $("#emp1").addClass('hidden');
  //default index selected
  } else {
    $("#emp1").addClass('hidden');
    $("#emp2").addClass('hidden');
  }
});