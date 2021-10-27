/*! jQuery  | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
$(document).ready(function() {
    $("input[name$='cars']").click(function() {
        var test = $(this).val();

        $("div.desc2").hide();
        $("#Cars" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='trucks']").click(function() {
        var test = $(this).val();

        $("div.desc").hide();
        $("#Trucks" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='planes']").click(function() {
        var test = $(this).val();

        $("div.desc3").hide();
        $("#Planes" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='trains']").click(function() {
        var test = $(this).val();

        $("div.desc5").hide();
        $("#Trains" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='boats']").click(function() {
        var test = $(this).val();

        $("div.desc4").hide();
        $("#Boats" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='jetskis']").click(function() {
        var test = $(this).val();

        $("div.desc6").hide();
        $("#Jetskis" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='scooters']").click(function() {
        var test = $(this).val();

        $("div.desc7").hide();
        $("#Scooters" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='skateboards']").click(function() {
        var test = $(this).val();

        $("div.desc8").hide();
        $("#Skateboards" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='hoverboards']").click(function() {
        var test = $(this).val();

        $("div.desc9").hide();
        $("#Hoverboards" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='motorcycles']").click(function() {
        var test = $(this).val();

        $("div.desc10").hide();
        $("#Motorcycles" + test).show();
    });
});

$(document).ready(function() {
    $("input[name$='bikes']").click(function() {
        var test = $(this).val();

        $("div.desc11").hide();
        $("#Bikes" + test).show();
    });
});