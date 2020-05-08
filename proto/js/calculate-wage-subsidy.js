$(document).ready(function(){	
    //Calculate with new inputs
    $("#parent-of-employee-rows").change(function(field){
        //get row number
        idNum = field.target.id.substr(field.target.id.lastIndexOf("-")+1);
        currentIncome = $('#current-income-'+idNum).val();
        preCrisisIncome = $('#pre-crisis-income-'+idNum).val();
        //check if current and pre-crisis income is input
        if (preCrisisIncome > 0 || currentIncome > 0) {
            //calcs
            if (currentIncome < (0.75*preCrisisIncome)) {
                $('#employee-subsidy-'+idNum).val(currentIncome) ;
            } else if ((0.75*currentIncome) < (0.75*preCrisisIncome)) {
                $('#employee-subsidy-'+idNum).val((0.75*preCrisisIncome));
            } else {
                $('#employee-subsidy-'+idNum).val((0.75*currentIncome));
            }
        }
        if (847 < $('#employee-subsidy'+idNum).val()) {
            $('#employee-subsidy'+idNum).val(847);
        }
        if ($('#arms-length'+idNum).is(':checked') && preCrisisIncome == 0) {
            $('#employee-subsidy-'+idNum).val("0");
        }
    });
});

$("#new-employee-row-button").click(function(){
    //generate id's with the following:
    $(document).ready(function(){
        //Calculation
        lastRowId = $('#parent-of-employee-rows').children().last().children().children('.input-group').children('input')[0].id;
        prevIdNum = lastRowId.substr(lastRowId.lastIndexOf("-")+1);
        newIdNum = parseInt(prevIdNum) + 1;
        //When you add any HTML for the new row, just add '+newIdNum+' to wherever you're appending the id
        //Example of adding a new row: .html('<input id="current-income-'+newIdNum+'">');
        var clone = $("#parent-of-employee-rows").children().first().clone();
        console.log(clone);
        clone.find(":input").val("");
        clone.find("#[id^='employee-subsidy-']").val('employee-subsidy-'+newIdNum);
        clone.find("#[id^='arms-length-']").val('arms-length-'+newIdNum);
        clone.find("#[id^='current-income-']").val('current-income-'+newIdNum);
        clone.find("#[id^='pre-crisis-income-']").val('pre-crisis-income-'+newIdNum);
        clone.appendTo('#parent-of-employee-rows');
     });

});

$("#calculate-button").click(function(){
    totalSubsidy = 0;
    //add up all per-employee fields
    $('#parent-of-employee-rows').find('.employee-subsidy').each(function () {
        //add up everything for the subsidy amount
        totalSubsidy = totalSubsidy + $(this).find('input').val();
    });
    //substract the extras
    totalSubsidy = totalSubsidy - $('#tenpercent').val() - $('#work-sharing').val();
    $('#total-subsidy-result').text(totalSubsidy);
    $('#answer-box').removeClass("hidden");
});