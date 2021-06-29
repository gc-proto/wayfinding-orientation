<script>
$(document).on("click", ".steps-wrapper button", function (event) {
	$("legend.wb-steps-active").parents().prevAll().find("legend.panel-heading").addClass("prev-wb-step");			
	$("legend.wb-steps-active").parents().nextAll().find("legend.panel-heading").removeClass("prev-wb-step");	
	$("legend.wb-steps-active").removeClass("prev-wb-step").attr("tabindex", "0");
	$("legend:not(.wb-steps-active)").attr("tabindex", "-1");
	//wrap with button
	$("legend.wb-steps-active").parents().prevAll().find("legend.panel-heading").wrapInner("<button class='btn-link p-0 btn-lgnd' type='button'></button>");
	$("fieldset legend.wb-steps-active").nextAll().addBack().find('.btn-lgnd').contents().unwrap();
	$(".btn-lgnd .btn-lgnd").contents().unwrap(); 
});
$(document).on("click", ".prev-wb-step", function (event) { 
	$(this).addClass("wb-steps-active").removeClass("prev-wb-step");
	$(this).parent().parent().find("legend + div.panel-body.hidden, .buttons").removeClass("hidden");
	$("legend.wb-steps-active").parents().nextAll().find(".wb-steps-active, legend.prev-wb-step").removeClass("wb-steps-active prev-wb-step");	
	$("legend.wb-steps-active").parents().nextAll().find("legend + div.panel-body, .buttons").addClass("hidden");	
});		
</script>	
<script>
    /**
     * EmployeeFormGenerator class
     * 
     * used to help creating new employee wage forms based on the chosen pay schedule
     */
    var EmployeeFormGenerator = (function () {
      /**
       * Constructor
       * 
       * @param {Int} paySchedule the numeric value of the chosen pay schedule
       */
      function EmployeeFormGenerator(paySchedule) {
        //the payschedule chosen by the user
        this.paySchedule = paySchedule;
        //variables to avoid magic numbers & strings
        this.prefix = "";
        this.numberOfEmployees = 1;
        this.weekly = 1;
        this.biWeekly = 2;
        this.templateId = "emp-1";
        this.armsLengthId = "arms-";
        this.crhpRemId = "amt-crhp-rem-";
        this.baselineId = "baseline-"
        this.employeeNumberClass = "employeeNumber";
        this.removeablePanelClass = "extra-emp-pnl";
        this.currencyPlaceholderValue = "$0";
        this.weeklySummaryBaseClass = "emp-wkly-wage-1";
        this.weeklySummaryClass = "emp-wkly-wage-";
        this.employeeIndexRegex = /-1$/g;
        this.prefix = this.weeklyPrefix
      }

      /**
       * generateNewEmployeeForm
       * 
       * function called to run the routine to generate the new form
       * 
       * @param {Int} numEmps the number of employee panels currently on the 
       * page
       * 
       * @return {DOMDocumentFragment} the cloned template with ID's and other 
       * attributes updated for use in as a new employee wage form
       */
      EmployeeFormGenerator.prototype.generateNewEmployeeForm = function (numEmps) {
        //update number of employee frames
        this.numberOfEmployees = numEmps;
        //generate another pay form
        var newForm = this.generateNewForm();
        return newForm;
      }

      /**
       * generateNewForm
       * 

       * clone the template DOM element and update the required attributes for 
       * a new employee wage form
       * 
       * @calls EmployeeFormGenerator::updateArmsLengthElementId()
       * @calls EmployeeFormGenerator::updateBaselineWageElementId() to update 
       * the baseline wage element
       * @calls EmployeeFormGenerator::setUpdatesAndUpdatedByData() to update 
       * the data-updates and data-update-by attributes
       * @calls EmployeeFormGenerator::updateInputs() to update the input fields
       * @calls EmployeeFormGenerator::updateTableIds() to update the summary 
       * table cells
       * @calls EmployeeFormGenerator::openAccordion() to open all accordion 
       * elements
       *
       * @return {DOMDocumentFragment} the update DOM fragment to be used as 
       * the new employee wage form
       */
      EmployeeFormGenerator.prototype.generateNewForm = function () {
        var frag = $("#" + this.templateId).clone();
        //update the frame id
        $(frag).attr("id", $(frag).attr("id").replace("-1", "-" + this.numberOfEmployees));
        //add class that will be used to identify panels to remove when the selected pay schedule is changed
        $(frag).addClass(this.removeablePanelClass);
        //update the employee number text
        var numEmps = this.numberOfEmployees;
        $(frag).find("." + this.employeeNumberClass).each(function (e, element) {
          $(element).text(numEmps);
        });
        //add the aria-live=polite attr for screen readers
        $(frag).attr("aria-live", "polite");
        var rmBtn = $(frag).find(".rm-emp");
        $(rmBtn).removeClass("hidden");
        //update the DOM fragment
        this.updateArmsLengthElementId(frag);
        this.updateBaselineWageElementId(frag);
        this.setUpdatesAndUpdatedByData(frag);
        this.updateInputs(frag);
        this.updateTableIds(frag);
        this.openAccordion(frag);
        this.updateSummaryHeading(frag);
        this.updateCRHPRem(frag);
        return frag;
      }

      /**
       * updateArmsLengthElementId
       * 
       * update the arms length dropdown element
       * 
       * @param {DOMDocumentFragment} frag the cloned template
       */
      EmployeeFormGenerator.prototype.updateArmsLengthElementId = function (frag) {
        var armsLengthElement = $(frag).find(
          "#" + this.armsLengthId + "1"
        );
        $(armsLengthElement).attr("id", $(armsLengthElement).attr("id").replace(this.employeeIndexRegex, "-" + this.numberOfEmployees));
        $(armsLengthElement).first("option").attr("selected", true);
      }

      /**
       * updateBaselineWageElementId
       * 
       * update the baseline wage input id and reset the value
       * 
       * @param {DOMDocumentFragment} frag the cloned template
       */
      EmployeeFormGenerator.prototype.updateBaselineWageElementId = function (frag) {
        var baselineWageElement = $(frag).find(
          "#" + this.baselineId + "1"
        );
        $(baselineWageElement).attr("id", $(baselineWageElement).attr("id").replace(this.employeeIndexRegex, "-" + this.numberOfEmployees));
        $(baselineWageElement).val("");
      }

      /**
       * updateInputs
       * 
       * update the id, class, and value for the new inputs. also update the 
       * label 'for' value with the new input id
       * 
       * @param {DOMDocumentFragment} frag the cloned template
       */
      EmployeeFormGenerator.prototype.updateInputs = function (frag) {
        var inputs = $(frag).find("input[id$='-1']");
        var numEmps = this.numberOfEmployees;
        var weeklyBaseClass = this.weeklySummaryBaseClass;
        var weeklyClass = this.weeklySummaryClass;
        var indexRegex = this.employeeIndexRegex;
        $(inputs).each(function (i, element) {
          if ($(element).is(":checkbox")) {
            $(element).prop("checked", false);
          } else if ($(element).attr("type", "text")) {
            $(element).val("");
          }
          //need to get the label for each of these elements and update the 'for' attr
          var label = $(frag).find("label[for='" + $(element).attr("id") + "']");
          $(element).attr(
            "id",
            $(element).attr("id").replace(indexRegex, "-" + numEmps)
          );
          $(label).attr(
            "for",
            $(label).attr("for").replace(indexRegex, "-" + numEmps)
          );
          //update the class that drives employee wage summary 
          if ($(element).hasClass(weeklyBaseClass)) {
            $(element).removeClass(weeklyBaseClass);
            $(element).addClass(weeklyClass + numEmps);
          }
        });
      }

      /**
       * setUpdatesAndUpdatedByData
       * 
       * increment the date-updates and data-updated-by value so the 
       * appropriate summary table is updated
       * 
       * @param {DOMDocumentFragment} frag the cloned template
       */
      EmployeeFormGenerator.prototype.setUpdatesAndUpdatedByData = function (frag) {
        var updateElements = $(frag).find("*[data-updates$='-1']");
        var updatedByElements = $(frag).find("*[data-updated-by$='-1']");
        var numEmps = this.numberOfEmployees;
        var indexRegex = this.employeeIndexRegex;
        $(updateElements).each(function (i, element) {
          var newval = $(element).data("updates").replace(indexRegex, "-" + numEmps);
          $(element).attr("data-updates", newval);
        });
        $(updatedByElements).each(function (i, element) {
          var newval = $(element).data("updated-by").replace(indexRegex, "-" + numEmps)
          $(element).attr("data-updated-by", newval);
        });
      }

      /**
       * updateTableIds
       * 
       * update table cell id and values required for employee wage summary
       * 
       * @param {DOMDocumentFragment} frag the cloned template
       */
      EmployeeFormGenerator.prototype.updateTableIds = function (frag) {
        var tds = $(frag).find("td[id$='-amt-1']");
        var totalCell = $(frag).find("td[id$='ttl-1']");
        // var remTotalCell = $(frag).find("td[id$='amt-crhp-rem-1']");
        var numEmps = this.numberOfEmployees;
        var currencyPlaceholderValue = this.currencyPlaceholderValue;
        var indexRegex = this.employeeIndexRegex;
        $(tds).each(function (i, element) {
          $(element).attr(
            "id",
            $(element).attr("id").replace(indexRegex, "-" + numEmps)
          );
          $(element).text(currencyPlaceholderValue);
        });
        $(totalCell).attr(
          "id",
          $(totalCell).attr("id").replace(indexRegex, "-" + numEmps)
        );
        // $(remTotalCell).attr(
        //   "id",
        //   $(remTotalCell).attr("id").replace(indexRegex, "-" + numEmps)
        // );
        $(totalCell).text(currencyPlaceholderValue);
        // $(remTotalCell).text(currencyPlaceholderValue);
        $(frag).find("#emp-no-elgbl-1").attr("id", "emp-no-elgbl-" + this.numberOfEmployees);
        $(frag).find("#emp-smry-1").attr("id", "emp-smry-" + this.numberOfEmployees);
      }

      /**
       * openAccordion
       *
       * open all open accordions
       *
       * @param {DOMDocumentFragment} frag the cloned template
       */
      EmployeeFormGenerator.prototype.openAccordion = function (frag) {
        var accordion = $(frag).find("details").each(function (i, element) {
          $(element).attr("open", "open");
        });
      }

      EmployeeFormGenerator.prototype.updateSummaryHeading = function (frag) {
        var heading = $(frag).find('.ee-name-1');
        $(heading).removeClass("ee-name-1");
        $(heading).addClass("ee-name-" + this.numberOfEmployees);
        $(heading).text("Employee " + this.numberOfEmployees);
      }

      EmployeeFormGenerator.prototype.updateCRHPRem = function(frag) {
        var remCRHP = $(frag).find(
          "#" + this.crhpRemId + "1"
        );
        $(remCRHP).attr("id", $(remCRHP).attr("id").replace(this.employeeIndexRegex, "-" + this.numberOfEmployees));
        $(remCRHP).text(this.currencyPlaceholderValue);
      }

      return EmployeeFormGenerator;
    })();

  </script> 
<script>
    (function ($, window, wb) {
      "use strict";
      /*
      * Variable and function definitions.
      * These are global to the plugin - meaning that they will be initialized once per page,
      * not once per instance of plugin on the page. So, this is a good place to define
      * variables that are common to all instances of the plugin on a page.
      */
      // function that should be moved as a helper class or something
      const toMoney = new Intl.NumberFormat(wb.lang + "-CA", {
        style: "currency",
        currency: "CAD",
        minimumFractionDigits: 2
      });
      var employeeFormGenerator = new EmployeeFormGenerator();
      var componentName = "wb-calc",
        selector = "." + componentName,
        initEvent = "wb-init" + selector,
        $document = wb.doc,
        defaults = {},
        sep = {
          iso: {
            en: "--",
            fr: "--"
          },
          claim: {
            en: " to ",
            fr: " au "
          }
        },
        /**
         * @method init
         * @param {jQuery Event} event Event that triggered the function call
         */
        init = function (event) {
          // Start initialization
          // returns DOM object = proceed with init
          // returns undefined = do not proceed with init (e.g., already initialized)

          var elm = wb.init(event, componentName, selector),
            $elm,
            settings;

          if (elm) {
            $elm = $(elm);
            // ... Do the plugin initialisation
            // Get the plugin JSON configuration set on attribute data-wb-helloworld
            settings = $.extend(
              true,
              {},
              defaults,
              window[componentName],
              wb.getData($elm, componentName)
            );

            // Call my custom event
            $elm.trigger("change", settings);
            // Identify that initialization has completed
            wb.ready($elm, componentName);
          }
        };

      // Plugin event handlers
      $document.on("change", "input", function (event) {
        var elm = event.currentTarget,
          $elm = $(elm),
          $elmId = $elm.attr("id"),
          data = wb.getData($("output[for='" + $elmId + "']"), componentName),
          value = $elm.val().replace(/\,\s/g, ''), // Needs to be replaced by data.expr evaluation
          total = 0;

        if (data.expr) {
          //protect against NaN values
          if (value == "") {
            value = 0;
          }
          if (data.format === "currency") {
            $("output[for='" + $elmId + "']").html(toMoney.format(value * 1));
          } else {
            $("output[for='" + $elmId + "']").html(value * 1);
          };
        }

        total = ($("#p2c-cews").val() * 1) + ($("#p3-ei").val() * 1) + ($("#p3-cpp").val() * 1) - ($("#p4-tws").val() * 1) - ($("#p4-wsb").val() * 1);
        if (total < 0) {
          $("[for='p2c-cews p3-ei p3-cpp p4-tws p4-wsb']").html(toMoney.format(0));
        } else {
          $("[for='p2c-cews p3-ei p3-cpp p4-tws p4-wsb']").html(toMoney.format(total));
        };
      });

      $document.on("change", selector, function (event, data) {
        var elm = event.currentTarget,
          $elm = $(elm),
          $input = $("#" + $elm.attr("for")),
          value = $input.val();

        if (data && data.format === "currency") {
          $elm.html(toMoney.format(value * 1));
        } else {
          $elm.html(value * 1);
        };
        $("[for='p2c-ee p2c-pyrl p2c-cews p3-ei p3-cpp p4-tws p4-wsb']").html(toMoney.format(0));
      });

      //when the claim period dropdown is changed
      $document.on("change", "#claim-period", function (event) {
        var rangeISO = $(this).find('option:selected').val(),
          startDateISO = rangeISO.substring(0, rangeISO.indexOf(sep.iso[wb.lang])),
          endDateISO = rangeISO.substring(rangeISO.indexOf(sep.iso[wb.lang]) + sep.iso[wb.lang].length, rangeISO.length),
          rangeClaim = $(this).find("option:selected").text(),
          rangeClaimNo = rangeClaim.substring(7, 8),
          startDateClaim = rangeClaim.substring(0, rangeClaim.indexOf(sep.claim[wb.lang])),
          endDateClaim = rangeClaim.substring(rangeClaim.indexOf(sep.claim[wb.lang]) + sep.claim[wb.lang].length, rangeClaim.length);
        
        // var endDateParts = endDateISO.split("-");
        var claimMonth = getClaimMonth(rangeISO);
        var claimPeriod = parseInt($("#claim-period option:selected").data("claim-period"));
        // var claimMonths = getMonthNamesPlusYear(endDateParts[1], claimPeriod); //send the endDate month number
        if (!$("#claim-period option:selected:eq(0)")) {
          $('.claim-period').html("<time datetime=\"" + startDateISO + "\">" + startDateClaim + "</time>" + sep.claim[wb.lang] + "<time datetime=\"" + endDateISO + "\">" + endDateClaim + "</time>");
          $(".crhp-rate").text(toPercent(0));
        } else {
          $('.claim-period').html($("#claim-period option:selected").text());
          $(".claim-period-no").text(claimPeriod);
          if ((revReduction >= 0.1 && claimPeriod > 17) || (revReduction > 0 && claimPeriod == 17)) {
            var crhpRateScale = [50, 50, 50, 40, 30, 20];
            $(".crhp-rate").text(toPercent(crhpRateScale[claimPeriod - 17]));
            crhpRate = parseFloat("0." + crhpRateScale[claimPeriod - 17]);
          } else {
            $(".crhp-rate").text(toPercent(0));
            $('.crhp-eligible-tag').addClass("hidden");
            crhpRate = 0;
          }
          if (claimPeriod < 17) {
            $("#details-panel2-lnk").parent().addClass("hidden");
          } else {
            $("#details-panel2-lnk").parent().removeClass("hidden");
          }
        }
        //show/hide elements based on chosen claim period

        //defaults
        var nolongeravailablePeriod = "";
        $('*[class*="nolongeravailable-1-"]').addClass("hidden");
        if ($('*[class*="nolongeravailable-1-"]').length > 0) {
          var nolongeravailable = $('*[class*="nolongeravailable-1-"]').attr('class');
          nolongeravailable = nolongeravailable.split(" ");
          $(nolongeravailable).each(function (i, element) {
            if (nolongeravailable[i].indexOf("longeravailable-1-") > 0) {
              nolongeravailablePeriod = nolongeravailable[i].split("-")[2];
            }
          });
          if (claimPeriod <= nolongeravailablePeriod) {
            $('*[class*="nolongeravailable-1-"]').removeClass("hidden");
          }
        }


		    //defaults
        $("#2021-11-yes").closest("div.form-group").addClass("hidden");
        $("#2021-10-yes").closest("div.form-group").addClass("hidden");
        $("#2021-09-yes").closest("div.form-group").addClass("hidden");
        $("#2021-08-yes").closest("div.form-group").addClass("hidden");
        $("#2021-07-yes").closest("div.form-group").addClass("hidden");
        $("#2021-06-yes").closest("div.form-group").addClass("hidden");
        $("#2021-05-yes").closest("div.form-group").addClass("hidden");
        $("#2021-04-yes").closest("div.form-group").addClass("hidden");
        $("#2021-03-yes").closest("div.form-group").addClass("hidden");
        $("#2021-02-yes").closest("div.form-group").addClass("hidden");
        $("#2021-01-yes").closest("div.form-group").addClass("hidden");
        $("#2020-12-yes").closest("div.form-group").addClass("hidden");
        $("#2020-11-yes").closest("div.form-group").addClass("hidden");
        $("#2020-10-yes").closest("div.form-group").addClass("hidden");
        $("#2020-09-yes").closest("div.form-group").addClass("hidden");
        $("#2020-08-yes").closest("div.form-group").addClass("hidden");
        $("#2020-07-yes").closest("div.form-group").addClass("hidden");
        $("#2020-06-yes").closest("div.form-group").addClass("hidden");
        $("#2020-05-yes").closest("div.form-group").addClass("hidden");
        $("#2020-04-yes").closest("div.form-group").addClass("hidden");
        $("#2021-11-no").closest("div.form-group").addClass("hidden");
        $("#2021-10-no").closest("div.form-group").addClass("hidden");
        $("#2021-09-no").closest("div.form-group").addClass("hidden");
        $("#2021-08-no").closest("div.form-group").addClass("hidden");
        $("#2021-07-no").closest("div.form-group").addClass("hidden");
        $("#2021-06-no").closest("div.form-group").addClass("hidden");
        $("#2021-05-no").closest("div.form-group").addClass("hidden");
        $("#2021-04-no").closest("div.form-group").addClass("hidden");
        $("#2021-03-no").closest("div.form-group").addClass("hidden");
        $("#2021-02-no").closest("div.form-group").addClass("hidden");
        $("#2020-02-no").closest("div.form-group").addClass("hidden");
        $("#2021-01-no").closest("div.form-group").addClass("hidden");
        $("#2020-01-no").closest("div.form-group").addClass("hidden");
        $("#2020-12-no").closest("div.form-group").addClass("hidden");
        $("#2019-12-no").closest("div.form-group").addClass("hidden");
        $("#2020-11-no").closest("div.form-group").addClass("hidden");
        $("#2019-11-no").closest("div.form-group").addClass("hidden");
        $("#2020-10-no").closest("div.form-group").addClass("hidden");
        $("#2019-10-no").closest("div.form-group").addClass("hidden");
        $("#2020-09-no").closest("div.form-group").addClass("hidden");
        $("#2019-09-no").closest("div.form-group").addClass("hidden");
        $("#2020-08-no").closest("div.form-group").addClass("hidden");
        $("#2019-08-no").closest("div.form-group").addClass("hidden");
        $("#2020-07-no").closest("div.form-group").addClass("hidden");
        $("#2019-07-no").closest("div.form-group").addClass("hidden");
        $("#2020-06-no").closest("div.form-group").addClass("hidden");
        $("#2019-06-no").closest("div.form-group").addClass("hidden");
        $("#2020-05-no").closest("div.form-group").addClass("hidden");
        $("#2019-05-no").closest("div.form-group").addClass("hidden");
        $("#2020-04-no").closest("div.form-group").addClass("hidden");
        $("#2019-04-no").closest("div.form-group").addClass("hidden");
        $("#2019-03-no").closest("div.form-group").addClass("hidden");
        $("#2019-03-2-no").closest("div.form-group").addClass("hidden");
        $("#cal-sprdsht-p1-4").addClass("hidden");
        $("#cal-sprdsht-none").addClass("hidden");
        $("#cal-sprsht-p5").addClass("hidden");
        $("#cal-sprsht-p7").addClass("hidden");
        $("#cal-sprsht-p9").addClass("hidden");
        $("#cal-sprsht-p11").addClass("hidden");
        $("#no-crhp-message").addClass("hidden");
        $("#crhp-questions").removeClass("hidden");
        $(".crhp-eligible").removeClass("hidden");
        $(".p18-plus").addClass("hidden");
        $(".p17-only").addClass("hidden");
        $(".p18-only").addClass("hidden");
        $(".p19-only").addClass("hidden");
        $(".p20-only").addClass("hidden");
        $(".p17-plus").addClass("hidden");
        $(".p14-crhp").addClass("hidden");

        if (claimPeriod < 17) {
          $("#no-crhp-message").removeClass("hidden");
          $("#crhp-questions").addClass("hidden");
          $(".crhp-eligible").addClass("hidden");
        } else {
          $(".p17-plus").removeClass("hidden");
        }

        switch (claimPeriod) {
          case 22:
            $(".p18-plus").removeClass("hidden");
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-11-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-10-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-11-no").closest("div.form-group").removeClass("hidden");
            $("#2019-11-no").closest("div.form-group").removeClass("hidden");
            $("#2021-10-no").closest("div.form-group").removeClass("hidden");
            $("#2019-10-no").closest("div.form-group").removeClass("hidden");
            break;
          case 21:
            $(".p18-plus").removeClass("hidden");
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-10-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-09-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-10-no").closest("div.form-group").removeClass("hidden");
            $("#2019-10-no").closest("div.form-group").removeClass("hidden");
            $("#2021-09-no").closest("div.form-group").removeClass("hidden");
            $("#2019-09-no").closest("div.form-group").removeClass("hidden");
            break;
          case 20:
            $(".p18-plus").removeClass("hidden");
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p20-only").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-09-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-08-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-09-no").closest("div.form-group").removeClass("hidden");
            $("#2019-09-no").closest("div.form-group").removeClass("hidden");
            $("#2021-08-no").closest("div.form-group").removeClass("hidden");
            $("#2019-08-no").closest("div.form-group").removeClass("hidden");
            break;
          case 19:
            $(".p18-plus").removeClass("hidden");
            $(".p19-only").removeClass("hidden");
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-08-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-07-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-08-no").closest("div.form-group").removeClass("hidden");
            $("#2019-08-no").closest("div.form-group").removeClass("hidden");
            $("#2021-07-no").closest("div.form-group").removeClass("hidden");
            $("#2019-07-no").closest("div.form-group").removeClass("hidden");
            break;
          case 18:
            $(".p18-only").removeClass("hidden");
            $(".p18-plus").removeClass("hidden");
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-07-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-06-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-07-no").closest("div.form-group").removeClass("hidden");
            $("#2019-07-no").closest("div.form-group").removeClass("hidden");
            $("#2021-06-no").closest("div.form-group").removeClass("hidden");
            $("#2019-06-no").closest("div.form-group").removeClass("hidden");
            break;
          case 17:
            $(".p17-only").removeClass("hidden");
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-06-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-05-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-06-no").closest("div.form-group").removeClass("hidden");
            $("#2019-06-no").closest("div.form-group").removeClass("hidden");
            $("#2021-05-no").closest("div.form-group").removeClass("hidden");
            $("#2019-05-no").closest("div.form-group").removeClass("hidden");
            break;
          case 16:
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-05-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-04-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-05-no").closest("div.form-group").removeClass("hidden");
            $("#2019-05-no").closest("div.form-group").removeClass("hidden");
            $("#2021-04-no").closest("div.form-group").removeClass("hidden");
            $("#2019-04-no").closest("div.form-group").removeClass("hidden");
            break;
          case 15:
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-04-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-03-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-04-no").closest("div.form-group").removeClass("hidden");
            $("#2019-04-no").closest("div.form-group").removeClass("hidden");
            $("#2021-03-no").closest("div.form-group").removeClass("hidden");
            $("#2019-03-no").closest("div.form-group").removeClass("hidden");
            break;
          case 14:
            $(".p14-crhp").removeClass("hidden");
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-03-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-02-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-03-no").closest("div.form-group").removeClass("hidden");
            $("#2019-03-2-no").closest("div.form-group").removeClass("hidden");
            $("#2021-02-no").closest("div.form-group").removeClass("hidden");
            $("#2020-02-no").closest("div.form-group").removeClass("hidden");
            break;
          case 13:
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-02-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-01-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-02-no").closest("div.form-group").removeClass("hidden");
            $("#2020-02-no").closest("div.form-group").removeClass("hidden");
            $("#2021-01-no").closest("div.form-group").removeClass("hidden");
            $("#2020-01-no").closest("div.form-group").removeClass("hidden");
            break;
          case 12:
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2021-01-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-12-yes").closest("div.form-group").removeClass("hidden");
            $("#2021-01-no").closest("div.form-group").removeClass("hidden");
            $("#2020-01-no").closest("div.form-group").removeClass("hidden");
            $("#2020-12-no").closest("div.form-group").removeClass("hidden");
            $("#2019-12-no").closest("div.form-group").removeClass("hidden");
            break;
          case 11:
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").removeClass("hidden");
            $(".p11-only").removeClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2020-12-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-11-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-12-no").closest("div.form-group").removeClass("hidden");
            $("#2019-12-no").closest("div.form-group").removeClass("hidden");
            $("#2020-11-no").closest("div.form-group").removeClass("hidden");
            $("#2019-11-no").closest("div.form-group").removeClass("hidden");
            break;
          case 10:
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").removeClass("hidden");
            $(".p11-plus").addClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").removeClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $("#cal-sprsht-p9").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2020-12-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-11-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-10-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-09-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-12-no").closest("div.form-group").removeClass("hidden");
            $("#2019-12-no").closest("div.form-group").removeClass("hidden");
            $("#2020-11-no").closest("div.form-group").removeClass("hidden");
            $("#2019-11-no").closest("div.form-group").removeClass("hidden");
            $("#2020-10-no").closest("div.form-group").removeClass("hidden");
            $("#2019-10-no").closest("div.form-group").removeClass("hidden");
            $("#2020-09-no").closest("div.form-group").removeClass("hidden");
            $("#2019-09-no").closest("div.form-group").removeClass("hidden");
            break;
          case 9:
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").removeClass("hidden");
            $(".p11-plus").addClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").removeClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2020-11-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-10-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-09-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-08-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-11-no").closest("div.form-group").removeClass("hidden");
            $("#2019-11-no").closest("div.form-group").removeClass("hidden");
            $("#2020-10-no").closest("div.form-group").removeClass("hidden");
            $("#2019-10-no").closest("div.form-group").removeClass("hidden");
            $("#2020-09-no").closest("div.form-group").removeClass("hidden");
            $("#2019-09-no").closest("div.form-group").removeClass("hidden");
            $("#2020-08-no").closest("div.form-group").removeClass("hidden");
            $("#2019-08-no").closest("div.form-group").removeClass("hidden");
            break;
          case 8:
            $(".p7-and-before").addClass("hidden");
            $(".p8-plus").removeClass("hidden");
            $(".p11-plus").addClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").removeClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2020-10-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-09-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-08-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-07-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-10-no").closest("div.form-group").removeClass("hidden");
            $("#2019-10-no").closest("div.form-group").removeClass("hidden");
            $("#2020-09-no").closest("div.form-group").removeClass("hidden");
            $("#2019-09-no").closest("div.form-group").removeClass("hidden");
            $("#2020-08-no").closest("div.form-group").removeClass("hidden");
            $("#2019-08-no").closest("div.form-group").removeClass("hidden");
            $("#2020-07-no").closest("div.form-group").removeClass("hidden");
            $("#2019-07-no").closest("div.form-group").removeClass("hidden");
            break;
          case 7:
            $(".p7-and-before").removeClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").addClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").removeClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2020-09-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-08-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-07-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-06-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-09-no").closest("div.form-group").removeClass("hidden");
            $("#2019-09-no").closest("div.form-group").removeClass("hidden");
            $("#2020-08-no").closest("div.form-group").removeClass("hidden");
            $("#2019-08-no").closest("div.form-group").removeClass("hidden");
            $("#2020-07-no").closest("div.form-group").removeClass("hidden");
            $("#2019-07-no").closest("div.form-group").removeClass("hidden");
            $("#2020-06-no").closest("div.form-group").removeClass("hidden");
            $("#2019-06-no").closest("div.form-group").removeClass("hidden");
            break;
          case 6:
            $(".p7-and-before").removeClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").addClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").removeClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2020-08-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-07-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-06-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-05-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-08-no").closest("div.form-group").removeClass("hidden");
            $("#2019-08-no").closest("div.form-group").removeClass("hidden");
            $("#2020-07-no").closest("div.form-group").removeClass("hidden");
            $("#2019-07-no").closest("div.form-group").removeClass("hidden");
            $("#2020-06-no").closest("div.form-group").removeClass("hidden");
            $("#2019-06-no").closest("div.form-group").removeClass("hidden");
            $("#2020-05-no").closest("div.form-group").removeClass("hidden");
            $("#2019-05-no").closest("div.form-group").removeClass("hidden");
            break;
          case 5:
            $(".p7-and-before").removeClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").addClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").removeClass("hidden");
            $("#rate-reduction").removeClass("hidden");
            $(".emp-lv").removeClass("hidden");
            $("#p4-tws").prop("readonly", true);
            $("#p4-tws").val("0.00");
            $("#p4-tws-disclaimer").removeClass("hidden");
            $(".p59").removeClass("hidden");
            $(".p14").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            $("#2020-07-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-06-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-05-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-04-yes").closest("div.form-group").removeClass("hidden");
            $("#2020-07-no").closest("div.form-group").removeClass("hidden");
            $("#2019-07-no").closest("div.form-group").removeClass("hidden");
            $("#2020-06-no").closest("div.form-group").removeClass("hidden");
            $("#2019-06-no").closest("div.form-group").removeClass("hidden");
            $("#2020-05-no").closest("div.form-group").removeClass("hidden");
            $("#2019-05-no").closest("div.form-group").removeClass("hidden");
            $("#2020-04-no").closest("div.form-group").removeClass("hidden");
            $("#2019-04-no").closest("div.form-group").removeClass("hidden");
            break
          case 4:
          case 3:
          case 2:
          case 1:
            $(".p7-and-before").removeClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").addClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").addClass("hidden");
            $(".emp-lv").addClass("hidden");
            $("#p4-tws").prop("readonly", false);
            $("#p4-tws-disclaimer").addClass("hidden");
            $(".p14").removeClass("hidden");
            $(".p59").addClass("hidden");
            $("#cal-sprdsht-none").addClass("hidden");
            $(".btn-cews-cal").removeClass("disabled");
            $(".btn-cews-cal").prop("disabled", false);
            $(".choose-claim-period").addClass("hidden");
            break;
          default:
            $(".p7-and-before").removeClass("hidden");
            $(".p8-plus").addClass("hidden");
            $(".p11-plus").addClass("hidden");
            $(".p11-only").addClass("hidden");
            $(".p10-").addClass("hidden");
            $("#rate-reduction").addClass("hidden");
            $(".emp-lv").addClass("hidden");
            $("#p4-tws").prop("readonly", false);
            $("#p4-tws-disclaimer").addClass("hidden");
            $(".p59").addClass("hidden");
            $(".p14").removeClass("hidden");
            $(".btn-cews-cal").addClass("disabled");
            $(".btn-cews-cal").prop("disabled", true);
            $(".choose-claim-period").removeClass("hidden");
        }

        var topUpMultiplier = [1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.75, 1.75, 1.75, 1.75, 1.75, 1.75, 1.75, 1.25, 0.75, 0.5];
        $('.scaleTopUp').text(topUpMultiplier[claimPeriod - 5]);
        var scaleBase = [1.2, 1.2, 1.0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.875, 0.625, 0.25];
        $('.scaleBase').text(scaleBase[claimPeriod - 5]);

        //recalculate the summary based on the values that are already there
        if ($("#2020-" + claimMonth + "-no").is(":visible") || $("#2021-" + claimMonth + "-no").is(":visible")) {
          calculateRevenueDrop();
        } else if ($("#2020-" + claimMonth + "-yes").is(":visible") || $("#2021-" + claimMonth + "-yes").is(":visible")) {
          calculateRevenueDropAlt();
        // } else {
        //   NoCERSRate();
        }
      });

      /**
      * NoCERSRate()
      * Fill in default values of 0% when there's not enough information to determine the rate
      */
      function NoCEWSRate() {
        cewsRate = 0;
        crhpRate = 0;
        $(".currentRevReduction").text(toPercent("0"));
        $(".priorRevReduction").text(toPercent("0"));
        $(".preferentialRevReduction").text(toPercent("0"));
        $(".base-rate").text(toPercent("0"));
        recalculateAllEmployees();
      }

      function recalculateAllEmployees() {
        $(".arms-length-select").each(function (i, element) {
          var parts = $(element).prop("id").split("-");
          var employeeNumber = parts[parts.length - 1];
          recalculateEmployeeAmounts(employeeNumber);
        });
        calculateTotals();
      }

      // when the submit button is clicked

      
      $(document).on("click", ".steps-wrapper:nth-child(5) button:contains('Next')", function (event) {
        validationCheck(event);
      });
      $(document).on("click", ".steps-wrapper:nth-child(5) button:contains('Suivant')", function (event) {
        validationCheck(event);
      });
      
      function validationCheck(event) {
        event.preventDefault();
        //remove the required attribute in all hidden elements
        $("[required]:hidden").each(function (i, element) {
          $(element).removeAttr("required");
        });
        var count = 0,
          $elms = $(".wb-frmvld select[required], .wb-frmvld input[required]"),
          $emptyElms = [];
        //find all required fields that were left empty
        for (let i = 0; i < $($elms).length; i++) {
          var $elm = $($elms).eq(i);
          if ($elm.val() == "") {
            $emptyElms.push($elm);
            count++;
          }
        }
        //if WET4 already has errors, scroll to those
        if ($("#errors-default")[0]) {
          $('html, body').animate({ scrollTop: $("#errors-default").offset().top }, 'slow');
          //scroll to the FIRST element that failed custom validation
        } else if ($emptyElms[0]) {
          $('html, body').animate({ scrollTop: $($emptyElms[0]).offset().top }, 'slow');
          console.debug($emptyElms);
          //validation passed, show the results
        } else {
          $("#results").removeClass("hidden");
        }
      }


      // function recalculateAllEmployees() {
      //   $(".arms-length-select").each(function (i, element) {
      //     var parts = $(element).prop("id").split("-");
      //     var employeeNumber = parts[parts.length - 1];
      //     recalculateEmployeeAmounts(employeeNumber);
      //   });
      //   calculateTotals();
      // }

      /**
       * update the employee wage summary
       */
      var numEmployeePanels = 1;
      $document.on("blur", "*[data-updates]", function (event) {
        var target = event.target;
        var parts = target.id.split("-");
        var employeeNumber = parts[parts.length - 1];
        recalculateEmployeeAmounts(employeeNumber);
      });

      function recalculateEmployeeAmounts(employeeNumber) {
        var unformattedValue = [$("#wkone-" + employeeNumber).val().replace("$", ""), $("#wktwo-" + employeeNumber).val().replace("$", ""), $("#wkthree-" + employeeNumber).val().replace("$", ""), $("#wkfour-" + employeeNumber).val().replace("$", "")];
        var claimPeriod = $("#claim-period option:selected").data("claim-period");
        var outputFields = ['wkone-', 'wktwo-', 'wkthree-', 'wkfour-'];
        var weeklyCews = {};
        var crhpRem = {};
        var p1to4eligibility = claimPeriod < 5 ? checkEmployeeEligibility(employeeNumber) : "true";
        for (let i = 0; i < 4; ++i) {
          $('#emp-arms-' + employeeNumber).text($("#arms-" + employeeNumber).val().charAt(0).toUpperCase() + $("#arms-" + employeeNumber).val().slice(1));
          var armsLength = $("#arms-" + employeeNumber).val().toLowerCase() == "yes" || $("#arms-" + employeeNumber).val().toLowerCase() == "oui" ? true : false;
          var updateTarget = $('#' + $("#" + outputFields[i] + employeeNumber).attr("data-updates"));
          //if the target is a select element, capitalize the first letter then update the target
          var baselineWage = zeroIfEmpty($("#baseline-" + employeeNumber).val());
            //get the wkX prefix of the input being updated, look for the leave w/ pay input with the same prefix
          // var parts = outputFields[i].match(/(wk)(one|two|three|four)-/g);
          var weekNumber = outputFields[i].substring(0, outputFields[i].indexOf("-"));
          var paidLeave = $("#" + weekNumber + "-cb-" + employeeNumber).is(":checked");
          if (paidLeave) {
            crhpRem[i] = 0;
          } else {
            if (armsLength) {
              crhpRem[i] = Math.min(1129, zeroIfEmpty(unformattedValue[i]));;
            } else {
              crhpRem[i] = Math.min(1129, baselineWage, zeroIfEmpty(unformattedValue[i]));
            } 
          }
          //get the weekly cews; if it's not an int or float, use 0
          weeklyCews[i] = getWeeklyCEWS(armsLength, baselineWage, zeroIfEmpty(unformattedValue[i]), paidLeave);
          if (!isInt(weeklyCews[i]) && !isFloat(weeklyCews[i])) {
            weeklyCews[i] = 0;
          }
          if (p1to4eligibility) {
            $("#emp-no-elgbl-" + employeeNumber).addClass("hidden");
            $("#emp-smry-" + employeeNumber).removeClass("hidden");
          } else {
            weeklyCews[i] = 0;
            $("#emp-smry-" + employeeNumber).addClass("hidden");
            $("#emp-no-elgbl-" + employeeNumber).removeClass("hidden");
          }
          //format and update the targets using localized currency format
          var formattedVal = toMoney.format(weeklyCews[i]);
          $(updateTarget).text(formattedVal);
          var updatedByElements = $("*[data-updated-by='" + outputFields[i] + employeeNumber + "']");
          $(updatedByElements).each(function (j, element) {
            $(element).text(toMoney.format(unformattedValue[i]));
          });
        }
        // update the total
        if ($(updateTarget).data("updates")) {
            /*
              update the target to the total column and get all elements that make up the total
            */
            updateTarget = $("#" + $(updateTarget).attr("data-updates"));
            //get the total cews
            var employeeCews = getEmployeeCews(employeeNumber, baselineWage);
            var formattedTotal = toMoney.format(employeeCews);
            $(updateTarget).text(formattedTotal);
          }
          //calculate the total eligible remuneration for CRHP, and plop to 'amt-crhp-rem-' + employeeNumber
          var CRHPEmpRem = 0;
          for (let i = 0; i < 4; ++i) {
            CRHPEmpRem += crhpRem[i];
          }
          $("#amt-crhp-rem-" + employeeNumber).text(toMoney.format(CRHPEmpRem));
      }

      //when the user clicks the remove button on an employee panel
      $(document).on("click", ".rm-emp", function(event) {
        var fieldset = $(event.target).parent("fieldset");
        var id = $(fieldset).attr("id");
        var empNumber = id.split("-")[1];
        $("#emp-arms-" + empNumber).parent("tr").remove();
        $(fieldset).remove();
      });

      //https://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer
      function isInt(n) {
        return Number(n) === n && n % 1 === 0;
      }
      function isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
      }

      /**
       * getEmployeeCews()
       * 
       * get the cews total for an employee 
       * 
       * @param {Int} employeeNumber The employee panel number
       * @param {String} baselineWage The employees baseline pre-crisis wage
       *
       * @return {Float} Total calculated cews for this employee || 0 if not 
       * all data was entered
       */
      function getEmployeeCews(employeeNumber, baselineWage) {
        var armsLength = $("#arms-" + employeeNumber).val() == "Yes" || $("#arms-" + employeeNumber).val() == "Oui" ? true : false;
        var weekone = zeroIfEmpty($('#wkone-' + employeeNumber).val());
        var weekOnePaidLeave = $("#wkone-cb-" + employeeNumber).is(":checked");
        var weektwo = zeroIfEmpty($('#wktwo-' + employeeNumber).val());
        var weekTwoPaidLeave = $("#wktwo-cb-" + employeeNumber).is(":checked");
        var weekthree = zeroIfEmpty($('#wkthree-' + employeeNumber).val());
        var weekThreePaidLeave = $("#wkthree-cb-" + employeeNumber).is(":checked");
        var weekfour = zeroIfEmpty($('#wkfour-' + employeeNumber).val());
        var weekFourPaidLeave = $("#wkfour-cb-" + employeeNumber).is(":checked");
        var weekOneCews = getWeeklyCEWS(armsLength, baselineWage, weekone, weekOnePaidLeave);
        var weekTwoCews = getWeeklyCEWS(armsLength, baselineWage, weektwo, weekTwoPaidLeave);
        var weekThreeCews = getWeeklyCEWS(armsLength, baselineWage, weekthree, weekThreePaidLeave);
        var weekFourCews = getWeeklyCEWS(armsLength, baselineWage, weekfour, weekFourPaidLeave);
        if (
          isNaN(weekOneCews) ||
          isNaN(weekTwoCews) ||
          isNaN(weekThreeCews) ||
          isNaN(weekFourCews)
        ) {
          return 0;
        }
        return parseFloat(weekOneCews + weekTwoCews + weekThreeCews + weekFourCews);
      }

      /**
       * getEmployeeTotalWages
       * 
       * get the total wages paid for the given employee number
       *
       * @param {Int} employeeNumber The employee panel number 
       * 
       * @return {Float} The total wage paid for 4 weeks 
       */
      function getEmployeeTotalWages(employeeNumber) {
        var weekone = zeroIfEmpty($('#wkone-' + employeeNumber).val());
        var weektwo = zeroIfEmpty($('#wktwo-' + employeeNumber).val());
        var weekthree = zeroIfEmpty($('#wkthree-' + employeeNumber).val());
        var weekfour = zeroIfEmpty($('#wkfour-' + employeeNumber).val());
        return parseFloat(weekone) + parseFloat(weektwo) + parseFloat(weekthree) + parseFloat(weekfour);
      }

      /**
       * getEmployeeTotalWagesCrhp
       * 
       * get the total wages paid for the given employee number eligible for the CRHP
       *
       * @param {Int} employeeNumber The employee panel number 
       * 
       * @return {Float} The total wage paid for 4 weeks 
       */
       function getEmployeeTotalWagesCrhp(employeeNumber, basePay, armsLength) {
        var weeklyPay = [zeroIfEmpty($('#wkone-' + employeeNumber).val()), zeroIfEmpty($('#wktwo-' + employeeNumber).val()), zeroIfEmpty($('#wkthree-' + employeeNumber).val()), zeroIfEmpty($('#wkfour-' + employeeNumber).val())];
        var paidLeave = [$("#wkone-cb-" + employeeNumber).is(":checked"), $("#wktwo-cb-" + employeeNumber).is(":checked"), $("#wkthree-cb-" + employeeNumber).is(":checked"), $("#wkfour-cb-" + employeeNumber).is(":checked")];
        var totalRem = 0;
        for(let i = 0; i < 4; ++i) {
          if (!paidLeave[i]) {
            if (armsLength) {
              totalRem += Math.min(1129, weeklyPay[i]);
            } else {
              totalRem += Math.min(1129, weeklyPay[i], basePay);
            }
          }
        }
        return totalRem;
      }

      /**
       * calculate the total wages/total cews when the summary table is opened
       */
      $(document).on("click", "#showEmpTable", function (event) {
        calculateTotals();
      });
      var totalCews = 0;
      var totalWages = 0;
      var totalCrhp = 0;
      function calculateTotals() {
        var totalWagesPaid = 0;
        var cews = 0;
        var eligibleEmployees = 0;
        var crhpRemuneration = 0;
        var cewsBasic = 0;
        var eligibleCrhpRemuneration = 0;
        var claimPeriod = $("#claim-period option:selected").data("claim-period");
        $("#dataset-filter > tbody > tr").each(function (i, element) {
          var id = $(element).prop("id").split("emp")[1];
          var eligibility = true;
          if (document.documentElement.lang == "fr") {
            crhpRemuneration = crhpRemuneration + zeroIfEmpty($('#amt-crhp-rem-' + id).text().replace(/[^0-9,]/g, ''));
            cewsBasic = cewsBasic + zeroIfEmpty($('#amt-ttl-' + id).text().replace(/[^0-9,]/g, ''));
          } else {
            crhpRemuneration = crhpRemuneration + zeroIfEmpty($('#amt-crhp-rem-' + id).text().replace(/[^0-9.]/g, ''));
            cewsBasic = cewsBasic + zeroIfEmpty($('#amt-ttl-' + id).text().replace(/[^0-9.]/g, ''));
          }
          //determine the eligibility
          if ($("#emp-smry-" + id).hasClass("hidden")) {
            eligibility = false;
          }
          //show baselineWage or 0 if the baseline was left empty (protect against showing NaN)
          var baselineWage = $("#baseline-" + id).val();
          if (baselineWage == "") {
            $("#emp-base-" + id).text(toMoney.format("0.00"));
          } else {
            baselineWage = parseFloat(baselineWage);
          }
          $("#emp-base-" + id).text(toMoney.format(baselineWage));
          //show the arms length value
          var armsLength = $("#arms-" + id).val().toLowerCase() == "yes" || $("#arms-" + id).val().toLowerCase() == "oui" ? true : false;
          $("#emp-arms-" + id).text($("#arms-" + id).val());
          var totalCell = $("#emp-ttl-" + id);
          if (eligibility) {
            eligibleEmployees++;
            var employeeCews = zeroIfEmpty(getEmployeeCews(id, baselineWage));
            cews += employeeCews;
            totalWagesPaid += zeroIfEmpty(getEmployeeTotalWages(id));
            var formattedTotal = toMoney.format(Math.max(employeeCews, 0));
            $("#emp-ttl-" + id).text(employeeCews);
            $(totalCell).html(formattedTotal);
            eligibleCrhpRemuneration += zeroIfEmpty(getEmployeeTotalWagesCrhp(id, baselineWage, armsLength));
          } else {
            $(totalCell).html(toMoney.format(0.00));
          }
        });
        if (claimPeriod == 14) {
          $('.p14-base-crhp-rem').text(toMoney.format(eligibleCrhpRemuneration));
          $('.p14-base-crhp-rem').text(toMoney.format(eligibleCrhpRemuneration));
        }
        $(".numEmps").text(eligibleEmployees);
        $(".total").html(toMoney.format(cews));
        if (claimPeriod < 5) {
          var tempWageSubAmount = zeroIfEmpty($("#p4-tws").val());
        } else {
          var tempWageSubAmount = 0;
        }
        totalCews = cews + zeroIfEmpty($("#p3-ei").val()) + zeroIfEmpty($("#p3-cpp").val()) - tempWageSubAmount - zeroIfEmpty($("#p4-wsb").val());
        totalCews = Math.max(0, totalCews.toFixed(2));
        totalWages = totalWagesPaid.toFixed(2);
        $('.basic-cews').text(toMoney.format(cewsBasic));
        if (claimPeriod >= 5) {
          if (claimPeriod > 16) {
            $('.crhp-current-rem').text(toMoney.format(crhpRemuneration)); 
            totalCrhp = Math.max(0, (crhpRemuneration - baseCRHPRem) * crhpRate);
            $('.total-calculated-crhp').text(toMoney.format(totalCrhp)); 
            $('.current-crhp-remuneration').val(toMoney.format(totalWages));
            // $('.p14-crhp-remuneration').val(toMoney.format(totalWages));
            $('.crhp-incremental-rem').val(toMoney.format(Math.max(totalWages - baseCRHPRem, 0)));
            $('.crhp-rate').val(toPercent(crhpRate * 100));
          } else {
            totalCrhp = 0;
            $('.crhp-current-rem').text(toMoney.format(0)); 
            $('.crhp-incremental-rem').text(toMoney.format(0)); 
            $('.total-calculated-crhp').text(toMoney.format(0)); 
            $('.crhp-rate').text(toPercent(0)); 
          }

          var numWeeksLeaveWPay = $("input[id*='-cb-']:checked").length;
          var totalEmps = $("fieldset[id^='emp-']").length;
          var eligibleEmps = totalEmps - (0.25 * numWeeksLeaveWPay);
          //active eligible employees
          $(".total-active-emps").val(Math.ceil(eligibleEmps));
          //get eligible furloughed employees
          $(".total-furloughed-emps").val(Math.ceil(totalEmps - eligibleEmps));
          // $("#p2c-ee-alt2").trigger("change");
          // if ($("#p2c-ee-alt2").val() == 0) {
          //   $("#p3-ei").prop("readonly", true);
          //   $("#p3-ei").val("0.00");
          //   $("#p3-cpp").prop("readonly", true);
          //   $(".p3-ee-req").addClass("hidden");
          //   $("#p3-cpp").val("0.00");
          //   $(".no-lwp-disclaimer").removeClass("hidden");
          // } else {
          //   $("#p3-ei").prop("readonly", false);
          //   $("#p3-ei").val("");
          //   $("#p3-cpp").prop("readonly", false);
          //   $(".p3-ee-req").removeClass("hidden");
          //   $("#p3-cpp").val("");
          //   $(".no-lwp-disclaimer").addClass("hidden");
          // }
          // var totalWages = $(".total").attr("data-total-wages");
          $(".cews-remuneration-total").val(toMoney.format(totalWages));
          // $("#p2c-pyrl").trigger("change");
          // var totalCews = $(".total").attr("data-total-cews");
          $(".total-calculated-cews").val(toMoney.format(totalCews));
          // $("#p2c-cews").trigger("change");
          if (claimPeriod < 11) {
            var revenuePriorDisplay = Math.max(0, roundPercDown(priorRevReduc));
            var revenueDisplay = Math.max(0, roundPercDown(currentRevReduc));
          } else if (claimPeriod == 17 && revReduction <= 0) {
            if (revReductionCRHPcur > 0) {
              var revenuePriorDisplay = 0.01;
            }
            if (revReductionCRHPprev > 0) {
              var revenueDisplay = 0.01;
            }
          } else if (claimPeriod > 17 && revReduction <= 0.1) {
            if (revReductionCRHPcur > 10) {
              var revenuePriorDisplay = 10.01;
            }
            if (revReductionCRHPprev > 10) {
              var revenueDisplay = 10.01;
            }
          } else {
            var revenuePriorDisplay = Math.max(0, priorRevReduc * 100);
            revenuePriorDisplay = revenuePriorDisplay.toFixed(2);
            var revenueDisplay = Math.max(0, currentRevReduc * 100);
            revenueDisplay = revenueDisplay.toFixed(2);
          }
          $("#p2b-c0").val(revenuePriorDisplay);
          $("output[for='p2b-c0']").text(toPercent(revenuePriorDisplay));
          $("#p2b-c1").val(revenueDisplay);
          $("output[for='p2b-c1']").text(toPercent(revenueDisplay));
          var threeMonthRevenueDisplay = Math.max(0, roundPercDown(threeMonthReduction));
          $("#p2b-c2").val(threeMonthRevenueDisplay);
          $("output[for='p2b-c2']").text(toPercent(threeMonthRevenueDisplay));
          var cewsRateDisplay = cewsRate * 100;
          cewsRateDisplay = cewsRateDisplay.toFixed(2);
          $("#p2b-c3").val(cewsRateDisplay);
          $("output[for='p2b-c3']").text(toPercent(cewsRateDisplay));
        } else {
          $(".cews-remuneration-total").val(toMoney.format(totalWages));
          $(".total-calculated-cews").val(toMoney.format(totalCews));
        }
        var eligibleEmployees = $("fieldset[id^='emp-']").length;
        for (var i = 1; i < $("fieldset[id^='emp-']").length; i++) {
          if ($("#emp-smry-" + i).hasClass("hidden")) {
            eligibleEmployees--;
          }
        }
        $(".total-eligible-emps").text(Math.ceil(eligibleEmployees));
        // for (var i = 1; i < (numEmployeePanels + 1); i++) {
        //   $("#wkone-" + i).blur();
        //   $("#wktwo-" + i).blur();
        //   $("#wkthree-" + i).blur();
        //   $("#wkfour-" + i).blur();
        // }
        
        if (totalCrhp <= 0 && totalCews <= 0) {
          $("#not-qualify-either-alert").removeClass("hidden");
          $(".not-yet-apply-alert").addClass("hidden");
          $('.crhp-no .hidden-print a').removeClass('btn-default');
          $('.crhp-no .hidden-print a').removeClass('btn-call-to-action');
          $('#cews-no .hidden-print a').removeClass('btn-default');
          $('#cews-no .hidden-print a').removeClass('btn-call-to-action');
          $('.crhp-no .hidden-print a').addClass('btn-default');
          $('#cews-no .hidden-print a').addClass('btn-default');
        } else if (claimPeriod > 16 && totalCrhp > totalCews && !$("#details-panel2-lnk").parent().hasClass("hidden")) {
          $("#same-amount-from-both").addClass("hidden");
          $("#different-amount-from-both").removeClass("hidden");
          $("#not-qualify-either-alert").addClass("hidden");
          $(".not-yet-apply-alert").removeClass("hidden");
          $("#details-panel2-lnk").click(); //default select the CRHP tab
          if (document.documentElement.lang == "fr") {
            $('.subsidy-to-apply-for').text('PEREC');
            $('.subsidy-for-information').text('SSUC');
          } else {
            $('.subsidy-to-apply-for').text('CRHP');
            $('.subsidy-for-information').text('CEWS');
          }
          $('.crhp-fyi').addClass("hidden");
          $('.cews-fyi').removeClass("hidden");
          $("#cews-hta").addClass("hidden");
          $("#crhp-hta").removeClass("hidden");	
          $('.crhp-no .hidden-print a').removeClass('btn-default');
          $('.crhp-no .hidden-print a').removeClass('btn-call-to-action');
          $('#cews-no .hidden-print a').removeClass('btn-default');
          $('#cews-no .hidden-print a').removeClass('btn-call-to-action');
          $('.crhp-no .hidden-print a').addClass('btn-call-to-action');
          $('#cews-no .hidden-print a').addClass('btn-default');
          // $('.crhp-current-rem').text(toMoney.format(crhpRemuneration)); 
          // totalCrhp = Math.min(0, crhpRemuneration - baseCRHPRem) * crhpRate;
        } else {
          if (totalCrhp == totalCews) {
            $("#same-amount-from-both").removeClass("hidden");
            $("#different-amount-from-both").addClass("hidden");
          } else {
            $("#same-amount-from-both").addClass("hidden");
            $("#different-amount-from-both").removeClass("hidden");
          }
          $("#not-qualify-either-alert").addClass("hidden");
          $(".not-yet-apply-alert").removeClass("hidden");
          $("#details-panel1-lnk").click(); 
          if (document.documentElement.lang == "fr") {
            $('.subsidy-to-apply-for').text('SSUC');
            $('.subsidy-for-information').text('PEREC');
          } else {
            $('.subsidy-to-apply-for').text('CEWS');
            $('.subsidy-for-information').text('CRHP');
          }
          $('.crhp-fyi').removeClass("hidden");
          $('.cews-fyi').addClass("hidden");
          $("#crhp-hta").addClass("hidden");
          $("#cews-hta").removeClass("hidden");	
          //how to select the print preview button inside the hidden-print inside the CRHP vs CEWS?
          $('.crhp-no .hidden-print a').removeClass('btn-default');
          $('.crhp-no .hidden-print a').removeClass('btn-call-to-action');
          $('#cews-no .hidden-print a').removeClass('btn-default');
          $('#cews-no .hidden-print a').removeClass('btn-call-to-action');
          $('#cews-no .hidden-print a').addClass('btn-call-to-action');
          $('.crhp-no .hidden-print a').addClass('btn-default');
        }
      }
       

      /**
       * getWeeklyCEWS
       * 
       * determine the weekly cews amount based on claim period
       *
       * @param {Boolean} armsLength Whether the employee is at arms length
       * @param {String} baselineAmount The employees baseline pay pre-crisis
       * @param {String} weeklyAmount The weekly wage value
       * @param {Boolean} paidLeave Whether the employee was on paid leave for 
       * the week being calculated
       * 
       * @return {Int} The calculated weekly cews amount || 0 if no claim 
       * period is chosen
       */
      function getWeeklyCEWS(armsLength, baselineAmount, weeklyAmount, paidLeave) {
        var period = parseInt($("#claim-period option:selected").data("claim-period"));
        switch (true) {
          //period 1-4
          case (period < 5):
            return parseFloat(oldFormula(armsLength, weeklyAmount, baselineAmount).toFixed(2));
            break;
          // period 5-7
          case (period < 7):
            if (paidLeave) {
              return parseFloat(oldFormula(armsLength, weeklyAmount, baselineAmount).toFixed(2));
            } else {
              if (cewsRate == 0) {
                return 0;
              } else if (revReduction >= 0.3) {
                return parseFloat(Math.max(oldFormula(armsLength, weeklyAmount, baselineAmount), newFormula(armsLength, weeklyAmount, baselineAmount, cewsRate)).toFixed(2));
              } else {
                return parseFloat(Math.max(newFormula(armsLength, weeklyAmount, baselineAmount, cewsRate), 0).toFixed(2));
              }
            }
            break;
          case (period > 19): //no more paid leave after p19
            if (paidLeave || cewsRate == 0) {
              return 0;
            } else {
              return parseFloat(Math.max(newFormula(armsLength, weeklyAmount, baselineAmount, cewsRate), 0).toFixed(2));
            }
            break;
          case (period > 10): //paid leave changes
            if (paidLeave) {
              if (cewsRate > 0 && (armsLength || baselineAmount > 0)) {
                return parseFloat(Math.min(weeklyAmount, Math.max(500, Math.min(0.55 * baselineAmount, 595))).toFixed(2));
              }
              else
              {
                return 0;
              }
            } else {
              if (cewsRate == 0) {
                return 0;
              } else {
                return parseFloat(Math.max(newFormula(armsLength, weeklyAmount, baselineAmount, cewsRate), 0).toFixed(2));
              }
            }
            break;
          //periods 9 - 10
          case (period > 8): //paid leave changes
            if (paidLeave) {
              if (cewsRate > 0 && (armsLength || baselineAmount > 0)) {
                return parseFloat(Math.min(weeklyAmount, Math.max(500, Math.min(0.55 * baselineAmount, 573))).toFixed(2));
              }
              else
              {
                return 0;
              }
            } else {
              if (cewsRate == 0) {
                return 0;
              } else {
                return parseFloat(Math.max(newFormula(armsLength, weeklyAmount, baselineAmount, cewsRate), 0).toFixed(2));
              }
            }
            break;
          //period 7+
          case (period > 6):
            if (paidLeave) {
              return parseFloat(oldFormula(armsLength, weeklyAmount, baselineAmount).toFixed(2));
            } else {
              if (cewsRate == 0) {
                return 0;
              } else {
                return parseFloat(Math.max(newFormula(armsLength, weeklyAmount, baselineAmount, cewsRate), 0).toFixed(2));
              }
            }
            break;
          default:
            return 0;
        }
      }

      /**
       * determine if an employee has been paid $0 for two consecutive pays
       */
      function checkEmployeeEligibility(employeeNumber) {
        //get all inputs for this employees weekly wages
        var wages = [zeroIfEmpty($('#wkone-' + employeeNumber).val()), zeroIfEmpty($('#wktwo-' + employeeNumber).val()), zeroIfEmpty($('#wkthree-' + employeeNumber).val()), zeroIfEmpty($('#wkfour-' + employeeNumber).val())];
        var eligibility = true;
        for (let i = 0; i < 3; i++) {
          if (wages[i] == 0 && wages[i+1] == 0) {
            eligibility = false;
          }
        }
        return eligibility;
      }


      /**
       * add a new employee form  
       */
      $("#addemp").on("click", addEmp);
      $("#addemp").on("keypress", addEmp);
      function addEmp() {
        numEmployeePanels++;
        var frag = employeeFormGenerator.generateNewEmployeeForm(
          numEmployeePanels
        );
        //create new row for the calculation table
        var row = document.createElement("tr");
        row.id = "emp" + numEmployeePanels;
        //create the employee 'name' cell
        var eligibleEmployeeCell = document.createElement("td");
        var eeSpan = document.createElement("span");
        $(eeSpan).addClass("ee-name-" + numEmployeePanels);
        eeSpan.innerHTML = "Employee " + numEmployeePanels;
        eligibleEmployeeCell.appendChild(eeSpan);
        // create the arms length cell 
        var armsLengthCell = document.createElement("td");
        armsLengthCell.id = "emp-arms-" + numEmployeePanels;
        //create the cell for the baseline wage
        var baselineCell = document.createElement("td");
        baselineCell.id = "emp-base-" + numEmployeePanels;
        //create cells for each wage entry
        var weeklyWageCells = [];
        for (var i = 0; i < 4; i++) {
          weeklyWageCells[i] = document.createElement("td");
        }
        //add the data-update-by attr so these cells are populated by the blur event on *[data-updates]
        $(weeklyWageCells[0]).attr(
          "data-updated-by",
          "wkone-" + numEmployeePanels
        );
        $(weeklyWageCells[1]).attr(
          "data-updated-by",
          "wktwo-" + numEmployeePanels
        );
        $(weeklyWageCells[2]).attr(
          "data-updated-by",
          "wkthree-" + numEmployeePanels
        );
        $(weeklyWageCells[3]).attr(
          "data-updated-by",
          "wkfour-" + numEmployeePanels
        );
        //create the total cell
        var totalCell = document.createElement("td");
        totalCell.id = "emp-ttl-" + numEmployeePanels;
        //put the row together
        row.appendChild(eligibleEmployeeCell);
        row.appendChild(armsLengthCell);
        row.appendChild(baselineCell);
        $(weeklyWageCells).each(function (i, element) {
          row.appendChild(weeklyWageCells[i]);
        });
        //add the row to the table
        row.appendChild(totalCell);
        $("#dataset-filter > tbody").append(row);
        var lastEmpPanel = $("fieldset[id^='emp-']").last();
        $(frag).insertAfter(lastEmpPanel);
        $("#emp-" + numEmployeePanels).focus();
        document.getElementById($(frag).prop("id")).scrollIntoView({
          behavior: 'smooth'
        });
        $("#emp-no-elgbl-" + numEmployeePanels).addClass("hidden");
        $("#emp-smry-" + numEmployeePanels).removeClass("hidden");
      }


      //Needed to show/hide calculator or spreadsheet....can probably be removed when doaction feature works again in AEM (GCWeb 9.3)//	
      $('#show-online-calc').on("click", function() {
        $(this).addClass("btn-primary");
        $("#show-sprdsht").removeClass("btn-primary").addClass("btn-default");	
        $("#cal-calc").removeClass("hidden"); 
        $("#cews-cal-opt1").addClass("hidden"); 
        // $('#steps-example').reset();
        $('#claim-period').prop('selectedIndex', 0);
      });
      $('#show-sprdsht').on("click", function() {
        $(this).addClass("btn-primary");
        $("#show-online-calc").removeClass("btn-primary").addClass("btn-default");	
        $("#cews-cal-opt1").removeClass("hidden"); 
        $("#cal-calc").addClass("hidden"); 
      });	
      //Passes value of publically traded question to summary//
      // $('input:radio[name="bsn-eligibility"]').change(function(){		
      //   $('.crhp-eligible').text(
      //   $(this).val())
      // });
      //Next button clicks to show more of summary so far  (need to try and clean this up into an array//
      $(document).on("click", ".steps-wrapper:nth-child(2) button:contains('Next')", function (event) {
        $('#sec-2-a, #sec-2-b').removeClass("hidden");
        calculateRevenueDrop();
      });
      $(document).on("click", ".steps-wrapper:nth-child(2) button:contains('Suivant')", function (event) {
        $('#sec-2-a, #sec-2-b').removeClass("hidden");
        calculateRevenueDrop();
      });
      $(document).on("click", ".steps-wrapper:nth-child(3) button:contains('Next')", function (event) {
        $('#sec-3').removeClass("hidden");
      });
      $(document).on("click", ".steps-wrapper:nth-child(3) button:contains('Suivant')", function (event) {
        $('#sec-3').removeClass("hidden");
      });
      $(document).on("click", ".steps-wrapper:nth-child(4) button:contains('Next')", function (event) {
        $('#sec-4-a, #sec-4-b').removeClass("hidden");
      });
      $(document).on("click", ".steps-wrapper:nth-child(4) button:contains('Suivant')", function (event) {
        $('#sec-4-a, #sec-4-b').removeClass("hidden");
      });
      $(document).on("click", ".steps-wrapper:nth-child(5) button:contains('Next')", function (event) {
        $('#sec-5').removeClass("hidden");
        calculateTotals();
      });
      $(document).on("click", ".steps-wrapper:nth-child(5) button:contains('Suivant')", function (event) {
        $('#sec-5').removeClass("hidden");
        calculateTotals();
      });
      $(document).on("click", ".steps-wrapper:nth-child(6) button:contains('Next')", function (event) {
        $('#sec-6').removeClass("hidden");
      });	
      $(document).on("click", ".steps-wrapper:nth-child(6) button:contains('Suivant')", function (event) {
        $('#sec-6').removeClass("hidden");
      });	

      //Radio event listener
      $document.on("click", "input[type=radio]", function (event) {
        var target = event.target;
        var parts = target.name.split("-");
        var locationNumber = parts[parts.length - 1];
        if (target.name == "rev-comp") {
          if (target.id == "rev-comp-no") {
            $('#alt-bl-no').addClass("hidden");
						 $('.alt-bl-no').addClass("hidden");
            $('#alt-bl-yes').removeClass("hidden");
						$('.alt-bl-yes').removeClass("hidden");
            calculateRevenueDrop();
          } else {
            $('#alt-bl-no').removeClass("hidden");
						 $('.alt-bl-no').removeClass("hidden");
            $('#alt-bl-yes').addClass("hidden");
						 $('.alt-bl-yes').addClass("hidden");
            calculateRevenueDropAlt();
          }
        } else {
          if (target.name == "crhp-eligibility") {
            if (target.id == "elig-type-yes") {
              $('.crhp-ineligible-tag').addClass("hidden");
              $('#crhp-base-q1').removeClass("hidden");
              $('#crhp-ineligible').addClass("hidden");
              $('#crhp-base-summary').removeClass("hidden");
              $(".crhp-eligible").removeClass("hidden");
              $("#details-panel2-lnk").parent().removeClass("hidden");
              calculateTotals(); 
            } else {
              $('.crhp-ineligible-tag').removeClass("hidden");
              $('#crhp-base-q1').addClass("hidden");
              $('#crhp-ineligible').removeClass("hidden");
              $('#crhp-base-summary').addClass("hidden");
              $(".crhp-eligible").addClass("hidden");
              $("#details-panel2-lnk").parent().addClass("hidden");
              calculateTotals(); //Or maybe 'clear chrp'?
            }
            $('#crhp-eligibility-summary').removeClass('hidden');
          // } else if (target.name == "crhp-base-ready") {
          //   if (target.id == "crhp-base-yes") {
          //     // $('#crhp-base-q2').addClass("hidden");
          //     $('#crhp-base-manual').addClass("hidden");
          //     $('#crhp-base-input').removeClass("hidden");
          //     calculateTotals();
          //   } else {
          //     // $('#crhp-base-q2').removeClass("hidden");
          //     $('#crhp-base-manual').removeClass("hidden");
          //     $('#crhp-base-input').addClass("hidden");
          //     calculateTotals(); //Or maybe 'clear chrp'?
          //   }
          // } else if (target.name == "crhp-csv") {
          //   if (target.id == "crhp-csv-yes") {
          //     $('#crhp-base-csv').removeClass("hidden");
          //     $('#crhp-base-manual').addClass("hidden");
          //     $('#crhp-base-input').addClass("hidden");
          //     calculateTotals();
          //   } else {
          //     $('#crhp-base-csv').addClass("hidden");
          //     $('#crhp-base-manual').removeClass("hidden");
          //     $('#crhp-base-input').removeClass("hidden");
          //     calculateTotals(); //Or maybe 'clear chrp'?
          //   }
          }
        }
      });

      var baseCRHPRem = 0;
      //update the CRHP base amount summary
      $(document).on("blur", "#crhp-base-rem", function (event) {
        baseCRHPRem = zeroIfEmpty($('#crhp-base-rem').val());
        $('.crhp-base-rem').text(toMoney.format(baseCRHPRem));
        calculateTotals(); //Or maybe 'clear chrp'?
      });
      $(document).on("blur", "#crhp-base-active-emps", function (event) {
        var baseCRHPEmps = zeroIfEmpty($('#crhp-base-active-emps').val());
        $('.total-active-emps-14').text(baseCRHPEmps);
        // calculateCRHP(); //Or maybe 'clear chrp'?
      });

      // function uploadDealcsv () {}; 
      // /*------ Method for read uploded csv file ------*/
      // uploadDealcsv.prototype.getCsv = function(e) {
      //     let input = document.getElementById('p14csv');
      //     input.addEventListener('change', function() {
      //       if (this.files && this.files[0]) {
      //           var myFile = this.files[0];
      //           var reader = new FileReader();
      //           reader.addEventListener('load', function (e) {
      //               let csvdata = e.target.result; 
      //               parseCsv.getParsecsvdata(csvdata); // calling function for parse csv data 
      //           });
      //           reader.readAsBinaryString(myFile);
      //       }
      //     });
      //   }
      //   /*------- Method for parse csv data and display --------------*/
      //   uploadDealcsv.prototype.getParsecsvdata = function(data) {
      //       let parsedata = [];
      //       let newLinebrk = data.split("\n");
      //       var i = 0;
      //       for(i = 0; i < newLinebrk.length; i++) {
      //           parsedata.push(newLinebrk[i].split(","))
      //       }
      //       if (document.documentElement.lang == "fr") { //check that column headings are correct
      //         if (parsedata[0][1] != "Sansliendedépendance" || parsedata[0][2] != "Paieavantlacrise" || parsedata[0][3] != "Salairebruthebdomadairepourlapremièresemaine" || parsedata[0][4] != "Salairebruthebdomadairepourladeuxièmesemaine" || parsedata[0][5] != "Salairebruthebdomadairepourlatroisièmesemaine" || parsedata[0][6] != "Salairebruthebdomadairepourlaquatrièmesemaine" || parsedata[0][7] != "MontantdebaselaSSUCcalculée") {
      //           $('#crhp-csv-parse-error').removeClass("hidden");
      //           $('#crhp-base-manual').removeClass("hidden");
      //           $('#crhp-base-input').removeClass("hidden");
      //         } else {
      //           $('#crhp-csv-parse-error').addClass("hidden");
      //           $('#crhp-base-manual').addClass("hidden");
      //           $('#crhp-base-input').addClass("hidden");
      //         }
      //       } else {
      //         if (parsedata[0][1] != "Arm's length" || parsedata[0][2] != "Pre-crisis pay" || parsedata[0][3] != "Weekly gross pay for week 1" || parsedata[0][4] != "Weekly gross pay for week 2" || parsedata[0][5] != "Weekly gross pay for week 3" || parsedata[0][6] != "Weekly gross pay for week 4" || parsedata[0][7] != "Calculated basic CEWS amount") {
      //           $('#crhp-csv-parse-error').removeClass("hidden");
      //           $('#crhp-base-manual').removeClass("hidden");
      //           $('#crhp-base-input').removeClass("hidden");
      //         } else {
      //           $('#crhp-csv-parse-error').addClass("hidden");
      //           $('#crhp-base-manual').addClass("hidden");
      //           $('#crhp-base-input').addClass("hidden");
      //         }
      //       }
      //       var re = /[^\d.]/g;
      //       // if (parsedata[i][1] == "No") { //NAL employee
      //       //   p14rate = total / (Math.min(1129, zeroIfEmpty(parsedata[i][3].replace(re,'')), zeroIfEmpty(parsedata[i][2].replace(/[^\d.]\g,'')) + Math.min(1129, zeroIfEmpty(parsedata[i][4].replace(re,'')), zeroIfEmpty(parsedata[i][2].replace(re,''))) + Math.min(1129, zeroIfEmpty(parsedata[i][5].replace(re,'')), zeroIfEmpty(parsedata[i][2].replace(re,''))) + Math.min(1129, zeroIfEmpty(parsedata[i][6].replace(re,'')), zeroIfEmpty(parsedata[i][2].replace(re,'')))) 
      //       // } else {
      //       //   p14rate = total / (Math.min(1129, zeroIfEmpty(parsedata[i][3].replace(re,''))) + Math.min(1129, zeroIfEmpty(parsedata[i][4].replace(re,''))) + Math.min(1129, zeroIfEmpty(parsedata[i][5].replace(re,''))) + Math.min(1129, zeroIfEmpty(parsedata[i][6].replace(re,'')))) 
      //       // }
      //       //   week1 = p14rate * Math.min(1129, parsedata[i][3], parsedata[i][2])
      //       //   week2 = p14rate * Math.min(1129, parsedata[i][4], parsedata[i][2])
      //       //   week3 = p14rate * Math.min(1129, parsedata[i][5], parsedata[i][2])
      //       //   week4 = p14rate * Math.min(1129, parsedata[i][6], parsedata[i][2])
      //       baseCRHPRem = 0;
      //       var week1 = 0, week2 = 0, week3 = 0, week4 = 0;
      //       for(i = 1; i < parsedata.length; i++) { //for each employee
      //         if (parsedata[i][1] == "No") { //NAL employee
      //           week1 = Math.min(1129, zeroIfEmpty(parsedata[i][3].replace(re,'')), zeroIfEmpty(parsedata[i][2].replace(re,'')));
      //           week2 = Math.min(1129, zeroIfEmpty(parsedata[i][4].replace(re,'')), zeroIfEmpty(parsedata[i][2].replace(re,'')));
      //           week3 = Math.min(1129, zeroIfEmpty(parsedata[i][5].replace(re,'')), zeroIfEmpty(parsedata[i][2].replace(re,'')));
      //           week4 = Math.min(1129, zeroIfEmpty(parsedata[i][6].replace(re,'')), zeroIfEmpty(parsedata[i][2].replace(re,'')));
      //         } else { //Arm's length
      //           week1 = Math.min(1129, zeroIfEmpty(parsedata[i][3].replace(re,'')));
      //           week2 = Math.min(1129, zeroIfEmpty(parsedata[i][4].replace(re,'')));
      //           week3 = Math.min(1129, zeroIfEmpty(parsedata[i][5].replace(re,'')));
      //           week4 = Math.min(1129, zeroIfEmpty(parsedata[i][6].replace(re,'')));
      //         }
      //         baseCRHPRem = baseCRHPRem + week1 + week2 + week3 + week4;
      //       }
      //       $('.total-active-emps-14').text(parsedata.length - 1);
      //       $('.crhp-base-rem').text(toMoney.format(baseCRHPRem));
      //       calculateTotals(); //Or maybe 'clear chrp'?
      //   }
      //   var parseCsv = new uploadDealcsv();
      //   parseCsv.getCsv();

      /**
       * calculate the cews rate reductions
       */
      var currentRevReduc = 0;
      var priorRevReduc = 0;
      var revReduction = 0;
      var revReductionCRHPcur = 0;
      var revReductionCRHPprev = 0;
      var claimPeriodRevReduction = 0;
      var topUpRate = 0;
      var cewsRate = 0;
      var crhpRate = 0;
      var baseRate = 0;
      var threeMonthReduction = 0;
      $document.on("blur", ".cews-rate-calc", function(event) {calculateRevenueDrop()});
      function calculateRevenueDrop() {
        var claimPeriod = parseInt($("#claim-period option:selected").data("claim-period"));
        var cewsRateElements = $('.cews-rate-calc');
        //find the claim month based on the chosen claim period 
        var claimMonth = getClaimMonth($("#claim-period").val());
        //Get claim months function??
        var monthsArray = getClaimMonths(claimMonth, claimPeriod);
        var months2019Array = getClaimMonths2019(claimMonth, claimPeriod);
        if (claimPeriod == 14) { //use the other March 2019 input - display order swap
          months2019Array[0] = months2019Array[0] + '-2';
        }
        //get the previous month from the claim month
        var prevClaimMonth = claimMonth - 1;
        if (
            zeroIfEmpty($("#" + months2019Array[0] + "-no").val()) > 0 ||
            zeroIfEmpty($("#" + months2019Array[1] + "-no").val()) > 0
        ) {
          //get the value of the claim month
          var claimMonth2020Value = zeroIfEmpty($("#" + monthsArray[0] + "-no").val());
          var claimMonth2019Value = zeroIfEmpty($("#" + months2019Array[0] + "-no").val());
          //get the value of the previous month
          var prevClaim2020Value = zeroIfEmpty($("#" + monthsArray[1] + "-no").val());
          var prevClaim2019Value = zeroIfEmpty($("#" + months2019Array[1] + "-no").val());
          
          if (claimPeriod < 11) {
            //get the avg of the revenue from the previous three motnhs (2020)
            var threeMonthRev2020 = [
              zeroIfEmpty($("#" + monthsArray[3] + "-no").val()),
              zeroIfEmpty($("#" + monthsArray[2] + "-no").val()),
              zeroIfEmpty($("#" + monthsArray[1] + "-no").val())
            ];
            var threeMonthAvg2020 = (threeMonthRev2020[0] + threeMonthRev2020[1] + threeMonthRev2020[2]) / 3;
            //get the avg of the revenue from the previous three months (2019)
            var threeMonthRev2019 = [
              zeroIfEmpty($("#" + months2019Array[3] + "-no").val()),
              zeroIfEmpty($("#" + months2019Array[2] + "-no").val()),
              zeroIfEmpty($("#" + months2019Array[1] + "-no").val())
            ];
            var threeMonthAvg2019 = (threeMonthRev2019[0] + threeMonthRev2019[1] + threeMonthRev2019[2]) / 3;
            //get the rate reduction from the three month average
            if (threeMonthAvg2019 == 0) {
              threeMonthReduction = 0;
            } else {
              threeMonthReduction = (threeMonthAvg2019 - threeMonthAvg2020) / threeMonthAvg2019;
            }
          }
          //get the revenue reduction from claim/prev claim months from 2020 and 2019
          if (claimMonth2019Value == 0) {
            claimPeriodRevReduction = 0;
          } else {
            claimPeriodRevReduction = (claimMonth2019Value - claimMonth2020Value) / claimMonth2019Value;
          }
          if (claimMonth2019Value == 0) {
            revReduction = (prevClaim2019Value - prevClaim2020Value) / prevClaim2019Value;
            priorRevReduc = (prevClaim2019Value - prevClaim2020Value) / prevClaim2019Value;
            currentRevReduc = 0;
          } else if (prevClaim2019Value == 0) {
            revReduction = (claimMonth2019Value - claimMonth2020Value) / claimMonth2019Value;
            priorRevReduc = 0;
            currentRevReduc = (claimMonth2019Value - claimMonth2020Value) / claimMonth2019Value;
          } else {
            revReduction = Math.max(
              (claimMonth2019Value - claimMonth2020Value) / claimMonth2019Value,
              (prevClaim2019Value - prevClaim2020Value) / prevClaim2019Value
            );
            priorRevReduc = (prevClaim2019Value - prevClaim2020Value) / prevClaim2019Value;
            currentRevReduc = (claimMonth2019Value - claimMonth2020Value) / claimMonth2019Value;
          }
          if (claimPeriod > 16) {
            revReductionCRHPcur = roundPercUp(currentRevReduc);
            revReductionCRHPprev = roundPercUp(priorRevReduc);
          }
          if (claimPeriod > 10) {
            revReduction = parseFloat(revReduction).toFixed(4);
            threeMonthReduction = parseFloat(threeMonthReduction).toFixed(4);
          }
          //get the base rate
          baseRate = parseFloat(Math.max(getP5PlusBaseRate(revReduction), 0));
          //get the top-up rate
          if (claimPeriod > 10 || (claimPeriod > 7 && revReduction > threeMonthReduction)) {
            topUpRate = parseFloat(Math.max(getP5PlusTopUpRate(revReduction), 0));
          } else {
            topUpRate = parseFloat(Math.max(getP5PlusTopUpRate(threeMonthReduction), 0));
          }
          if (claimPeriod > 10) {
            topUpRate = parseFloat(topUpRate).toFixed(4);
            baseRate = parseFloat(baseRate).toFixed(4);
          }
          //calculate the overall rate
          cewsRate = parseFloat(baseRate) + parseFloat(topUpRate);
          cewsRate = parseFloat(cewsRate).toFixed(4);

          $(".rate-formula-max").addClass("hidden");
          $(".rate-formula-u70").addClass("hidden");
          $(".rate-formula-u50").addClass("hidden");
          $(".rate-formula-0").addClass("hidden");
          if (revReduction == 0) {
            $(".rate-formula-0").removeClass("hidden");
          } else if (revReduction < 0.5) {
            $(".rate-formula-u50").removeClass("hidden");
          } else if (revReduction < 0.7) {
            $(".rate-formula-u70").removeClass("hidden");
          } else if (revReduction >= 0.7) {
            $(".rate-formula-max").removeClass("hidden");
          }

          if (claimPeriod > 16) {
            if (revReductionCRHPcur <= 10 && revReductionCRHPprev <= 10 && claimPeriod > 17) {
              cewsRate = 0;
              crhpRate = 0;
              $(".greater-than-10-drop").addClass("hidden");
              $(".less-than-10-drop").removeClass("hidden");
            } else if (((revReductionCRHPcur > 10 || revReductionCRHPprev > 10) && claimPeriod > 17) || ((revReductionCRHPcur > 0 || revReductionCRHPprev > 0) && claimPeriod == 17)) {
              var crhpRateScale = [50, 50, 50, 40, 30, 20]
              if ((revReduction <= 0.1 && claimPeriod > 17) || (revReduction <= 0 && claimPeriod == 17)) {
                $(".10drop").removeClass("hidden");
                if (revReduction == 0) {
                  $(".rate-formula-0").addClass("hidden");
                  $(".rate-formula-u50").removeClass("hidden");
                }
              } else {
                $(".10drop").addClass("hidden");
              }
              $(".crhp-rate").text(toPercent(crhpRateScale[claimPeriod - 17]));
              $(".greater-than-10-drop").removeClass("hidden");
              $(".less-than-10-drop").addClass("hidden");
              crhpRate = parseFloat("0." + crhpRateScale[claimPeriod - 17]);
            }
          } else {
            $(".greater-than-10-drop").removeClass("hidden");
            $(".less-than-10-drop").addClass("hidden");
          }

          if (cewsRate < 0.1) {
            $("#employees").addClass("hidden");
          }
          if (cewsRate < 0.75 && revReduction >= 0.3 && claimPeriod < 7) {
            //if safe harbour applies
            cewsRate = 0.75;
            $("#rate-reduction").addClass("hidden");
            $(".safe-harbour-show").removeClass("hidden");
            $(".safe-harbour-hide").addClass("hidden");
          } else {
            //if safe harbour doesn't apply
            $(".safe-harbour-show").addClass("hidden");
            $(".safe-harbour-hide").removeClass("hidden");
            //update the view and round down base and top up dates to nearest 2 decimals on the percentage
            $(".top-up-rate").text(toPercent(roundPercDown(topUpRate)));
            $(".base-rate").text(toPercent(roundPercDown(baseRate)));
          }
          if (claimPeriod < 11) {
            $(".rev-drop-top-up").text(toPercent(roundPercDown(threeMonthReduction)));
            $(".currentRevReduction").text(toPercent(roundPercDown(currentRevReduc)));
            $(".priorRevReduction").text(toPercent(roundPercDown(priorRevReduc)));
            $(".rev-reduc-base").text(toPercent(roundPercDown(revReduction)));
          } else {
            var displayRevReducCurrent = currentRevReduc * 100;
            var displayPriorReducCurrent = priorRevReduc * 100;
            var displayPrefReducCurrent = revReduction * 100;
            $(".currentRevReduction").text(toPercent(displayRevReducCurrent.toFixed(2)));
            $(".priorRevReduction").text(toPercent(displayPriorReducCurrent.toFixed(2)));
            $(".rev-reduc-base").text(toPercent(displayPrefReducCurrent.toFixed(2)));
          }
          if (claimPeriod > 7 && claimPeriod < 11) {
            if (revReduction > threeMonthReduction) {
              $(".rev-drop-top-up-higher").text(toPercent(roundPercDown(revReduction)));
            } else {
              $(".rev-drop-top-up-higher").text(toPercent(roundPercDown(threeMonthReduction)));
            }
          }
          var cewsRateDisplay = cewsRate * 100;
          cewsRateDisplay = cewsRateDisplay.toFixed(2);
          $(".cews-rate").text(toPercent(cewsRateDisplay));
          $("#employees").removeClass("hidden");
        } else {
          //if it can't compute because of 0 values, then reset calculation summary to 0
          $(".currentRevReduction").text(toPercent("0"));
          $(".priorRevReduction").text(toPercent("0"));
          $(".top-up-rate").text(toPercent("0"));
          $(".base-rate").text(toPercent("0"));
          $(".rev-drop-top-up").text(toPercent("0"));
          $(".rev-reduc-base").text(toPercent("0"));
          $(".cews-rate").text(toPercent("0"));
        }
        recalculateAllEmployees();
      }


      //Checkbox event listener
      $document.on("click", "input[type=checkbox]", function (event) {
        var target = event.target;
        //Check which radio button it is and which content it's show/hiding
        if (target.id == "jan-feb-closed") {
          if ($('#jan-feb-closed-inputs').is(":hidden")) {
            $('#jan-feb-closed-inputs').removeClass("hidden");
          } else {
            $('#jan-feb-closed-inputs').addClass("hidden");
          }
          calculateRevenueDropAlt();
        }
      });

      /**
       * calculate the cews rate reductions with alternate baseline
       */
      $document.on("blur", ".cews-rate-calc-alt", function(event) {calculateRevenueDropAlt()});
      $document.on("blur", "#jan-feb-closed-days", function(event) {calculateRevenueDropAlt()});
      function calculateRevenueDropAlt() {
        var claimPeriod = parseInt($("#claim-period option:selected").data("claim-period"));
        var cewsRateElements = $('.cews-rate-calc-alt');
        var janRev = zeroIfEmpty($("#2020-01-yes").val());
        var febRev = zeroIfEmpty($("#2020-02-yes").val());
        if (parseFloat(janRev) > 0 || parseFloat(febRev) > 0) {
          var baseRevTopUp = (janRev + febRev) / 2;
          if ($('#jan-feb-closed-inputs').is(":visible")) {
            var daysNotOperating = zeroIfEmpty($('#jan-feb-closed-days').val());
            var baseRev = ((janRev + febRev) / 2) * (60 / (60 - daysNotOperating));
          } else {
            var baseRev = (janRev + febRev) / 2;
          }
          
          //find the claim month based on the chosen claim period 
          var claimMonth = getClaimMonth($("#claim-period").val());
          var monthsArray = getClaimMonths(claimMonth, claimPeriod);

          //get the value of the claim month
          var claimMonthValue = zeroIfEmpty($("#" + monthsArray[0] + "-yes").val());
          //get the value of the previous month
          var prevClaimValue = zeroIfEmpty($("#" + monthsArray[1] + "-yes").val());
          //get the avg of the revenue from the last three months
          if (claimPeriod < 10) {
            var threeMoAgo = zeroIfEmpty($("#" + monthsArray[3] + "-yes").val());
            var twoMoAgo = zeroIfEmpty($("#" + monthsArray[2] + "-yes").val());
            var threeMonthAvg = (threeMoAgo + twoMoAgo + prevClaimValue) / 3;
            //get the rate reduction from the three month average
            threeMonthReduction = (baseRevTopUp - threeMonthAvg) / baseRevTopUp;
          }
          claimPeriodRevReduction = (baseRev - claimMonthValue) / baseRev;
          //get the revenue reduction
          revReduction = Math.max(
            (baseRev - claimMonthValue) / baseRev,
            (baseRev - prevClaimValue) / baseRev
          );
          currentRevReduc = (baseRev - claimMonthValue) / baseRev;
          priorRevReduc = (baseRev - prevClaimValue) / baseRev;
          if (claimPeriod > 16) {
            revReductionCRHPcur = roundPercUp(currentRevReduc);
            revReductionCRHPprev = roundPercUp(priorRevReduc);
          }
          if (claimPeriod > 10) {
            revReduction = parseFloat(revReduction).toFixed(4);
            threeMonthReduction = parseFloat(threeMonthReduction).toFixed(4);
          }
          //get the base rate
          baseRate = parseFloat(
            Math.max(getP5PlusBaseRate(revReduction), 0)
          );
          //get the top-up rate
          if (claimPeriod > 10 || (claimPeriod > 7 && revReduction > threeMonthReduction)) {
            topUpRate = parseFloat(Math.max(getP5PlusTopUpRate(revReduction), 0));
          } else {
            topUpRate = parseFloat(Math.max(getP5PlusTopUpRate(threeMonthReduction), 0));
          }
          if (claimPeriod > 10) {
            topUpRate = parseFloat(topUpRate).toFixed(4);
            baseRate = parseFloat(baseRate).toFixed(4);
          }
          //calculate the overall rate
          cewsRate = parseFloat(baseRate) + parseFloat(topUpRate);
          cewsRate = parseFloat(cewsRate).toFixed(4);

          $(".rate-formula-max").addClass("hidden");
          $(".rate-formula-u70").addClass("hidden");
          $(".rate-formula-u50").addClass("hidden");
          $(".rate-formula-0").addClass("hidden");
          switch (true) {
              case (revReduction == 0):
                  $(".rate-formula-0").removeClass("hidden");
                  break;
              case (revReduction < 0.5):
                  $(".rate-formula-u50").removeClass("hidden");
                  break;
              case (revReduction < 0.7):
                  $(".rate-formula-u70").removeClass("hidden");
                  break;
              case (revReduction >= 0.7):
                  $(".rate-formula-max").removeClass("hidden");
                  break;
          }
          if (claimPeriod > 16) {
            if (revReductionCRHPcur <= 10 && revReductionCRHPprev <= 10 && claimPeriod > 17) {
              cewsRate = 0;
              crhpRate = 0;
              $(".greater-than-10-drop").addClass("hidden");
              $(".less-than-10-drop").removeClass("hidden");
            } else if (((revReductionCRHPcur > 10 || revReductionCRHPprev > 10) && claimPeriod > 17) || ((revReductionCRHPcur > 0 || revReductionCRHPprev > 0) && claimPeriod == 17)) {
              var crhpRateScale = [50, 50, 50, 40, 30, 20]
              if ((revReduction <= 0.1 && claimPeriod > 17) || (revReduction <= 0 && claimPeriod == 17)) {
                $(".10drop").removeClass("hidden");
                if (revReduction == 0) {
                  $(".rate-formula-0").addClass("hidden");
                  $(".rate-formula-u50").removeClass("hidden");
                }
              } else {
                $(".10drop").addClass("hidden");
              }
              $(".crhp-rate").text(toPercent(crhpRateScale[claimPeriod - 17]));
              $(".greater-than-10-drop").removeClass("hidden");
              $(".less-than-10-drop").addClass("hidden");
              crhpRate = parseFloat("0." + crhpRateScale[claimPeriod - 17]);
            }
          } else {
            $(".greater-than-10-drop").removeClass("hidden");
            $(".less-than-10-drop").addClass("hidden");
          }
          
          if (cewsRate < 0.1) {
            $("#employees").addClass("hidden");
          }
          if (cewsRate < 0.75 && revReduction >= 0.3 && claimPeriod < 7) {
            //if safe harbour applies
            cewsRate = 0.75;
            $("#rate-reduction").addClass("hidden");
            $(".safe-harbour-show").removeClass("hidden");
            $(".safe-harbour-hide").addClass("hidden");
          } else {
            //if safe harbour doesn't apply
            $(".safe-harbour-show").addClass("hidden");
            $(".safe-harbour-hide").removeClass("hidden");
            //update the view and round down base and top up dates to nearest 2 decimals on the percentage
            $(".top-up-rate-alt").text(toPercent(roundPercDown(topUpRate)));
            $(".base-rate-alt").text(toPercent(roundPercDown(baseRate)));
          }
          if (claimPeriod > 7 && claimPeriod < 11) {
            if (revReduction > threeMonthReduction) {
              $(".rev-drop-top-up-higher-alt").text(toPercent(roundPercDown(revReduction)));
            } else {
              $(".rev-drop-top-up-higher-alt").text(toPercent(roundPercDown(threeMonthReduction)));
            }
          }
          if (claimPeriod < 11) {
            $(".rev-drop-top-up-alt").text(toPercent(roundPercDown(threeMonthReduction)));
            $(".currentRevReduction-alt").text(toPercent(roundPercDown(currentRevReduc)));
            $(".priorRevReduction-alt").text(toPercent(roundPercDown(priorRevReduc)));
            $(".rev-reduc-alt-base").text(toPercent(roundPercDown(revReduction)));
          } else {
            var displayRevReducCurrent = currentRevReduc * 100;
            var displayPriorReducCurrent = priorRevReduc * 100;
            var displayPrefReducCurrent = revReduction * 100;
            $(".currentRevReduction-alt").text(toPercent(displayRevReducCurrent.toFixed(2)));
            $(".priorRevReduction-alt").text(toPercent(displayPriorReducCurrent.toFixed(2)));
            $(".rev-reduc-alt-base").text(toPercent(displayPrefReducCurrent.toFixed(2)));
          }
          var cewsRateDisplay = cewsRate * 100;
          cewsRateDisplay = cewsRateDisplay.toFixed(2);
          $(".cews-rate-alt").text(toPercent(cewsRateDisplay));
          $("#employees").removeClass("hidden");
        } else {
          //if it can't compute because of 0 values, then reset calculation summary to 0
          $(".currentRevReduction-alt").text(toPercent(0));
          $(".priorRevReduction-alt").text(toPercent(0));
          $(".top-up-rate-alt").text(toPercent(0));
          $(".base-rate-alt").text(toPercent(0));
          $(".rev-drop-top-up-alt").text(toPercent(0));
          $(".rev-reduc-alt-base").text(toPercent(0));
          $(".cews-rate-alt").text(toPercent(0));
        }
        recalculateAllEmployees();
      }


      /**
       * getClaimMonths()
       * returns an array of the 4 months with year and prefix based on the claim month
       */
      function getClaimMonths(claimMonth, claimPeriod) {
        var monthsArray = [claimMonth, claimMonth - 1, claimMonth - 2, claimMonth - 3];
        //Adding a 0 in front of a month in case it was single digit
        for (var i = 0; i < monthsArray.length; i++) {
          if (monthsArray[i] <= 0) { //non-months
            monthsArray[i] += 12;
          }
          if (monthsArray[i].toString().match(/^[1-9]$/)) { //checking for single digit, in which case add 0 ahead of it
            monthsArray[i] = "0" + monthsArray[i];

          }
          //get the year for the month based on period
          if (claimPeriod < 11) {
            monthsArray[i] = "2020-" + monthsArray[i];
          } else if (claimPeriod < 15) {
            if (parseInt(monthsArray[i]) > 5) {
              monthsArray[i] = "2020-" + monthsArray[i];
            } else {
              monthsArray[i] = "2021-" + monthsArray[i];
            }
          } else {
            monthsArray[i] = "2021-" + monthsArray[i];
          }
        }
        return monthsArray;
      }
       /**
       * getClaimMonths2019()
       * returns an array of the 4 months adjusted for year 2019
       */
       function getClaimMonths2019(claimMonth, claimPeriod) {
        var monthsArray = [claimMonth, claimMonth - 1, claimMonth - 2, claimMonth - 3];
        
        //Adding a 0 in front of a month in case it was single digit
        for (var i = 0; i < monthsArray.length; i++) {
          if (monthsArray[i] <= 0) { //negative numbers
            monthsArray[i]+= 12;
          }
          if (monthsArray[i].toString().match(/^[1-9]$/)) { //checking for single digit, in which case add 0 ahead of it
            monthsArray[i] = "0" + monthsArray[i];
          }
          if (claimPeriod < 11) {
            monthsArray[i] = "2019-" + monthsArray[i];
          } else {
            if ((claimPeriod < 14 && parseInt(monthsArray[i]) > 5) || (parseInt(monthsArray[i]) > 2)) {
              monthsArray[i] = "2019-" + monthsArray[i];
            } else {
              monthsArray[i] = "2020-" + monthsArray[i];
            }
          }
        }
        return monthsArray;
      }
      /**
       * roundPercDown()
       * round the given percent value to two decimal places
       */
      function roundPercDown(perc) {
        perc = perc * 10000;
        perc = Math.floor(perc);
        perc = perc / 100;
        return perc;
      }

      function roundPercUp(perc) {
        perc = perc * 10000;
        perc = Math.ceil(perc);
        perc = perc / 100;
        return perc;
      }

      /**
      * Apply the transforms necessary for FR vs EN syntax of percentages
      */
      function toPercent(percentage) {
        if (document.documentElement.lang == "fr") {
          return parseFloat(percentage).toFixed(2) + '\xa0%';
        } else {
          return parseFloat(percentage).toFixed(2) + '%';
        }
      }


      /**
       * zeroIfEmpty()
       * return 0 if the number cannot be parsed into a float; does not account * for letter values.
       */
      function zeroIfEmpty(fieldVal) {
        if (fieldVal != null && fieldVal != "") {
          return parseFloat(fieldVal);
        } else {
          return 0;
        }
      }

      /**
       * getMonthNamesPlusYear()
       *
       * get the name of the claim month and previous month
       *
       * @param {iMonth} integer the month expressed as an integer
       * YYYY-MM-DD--YYYY--MM-DD format
       *
       * @return {claimMonths} the 2 months that the CERS period overlaps
       */
      function getMonthNamesPlusYear(iMonth, claimPeriod) {
        if (document.documentElement.lang == "fr") {
          var monthNames = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
        } else {
          var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        }
        var claimMonths = [monthNames[iMonth - 2], monthNames[iMonth - 1]];
        if (iMonth == 1) {
          if (document.documentElement.lang == "fr") {
            claimMonths[0] = "décembre";
          } else {
            claimMonths[0] = "December";
          }
        }
        //add years
        if (claimPeriod < 4) {
          claimMonths[0] = claimMonths[0] + ' 2020';
          claimMonths[1] = claimMonths[1] + ' 2020';
        } else if (claimPeriod == 4) {
          claimMonths[0] = claimMonths[0] + ' 2020';
          claimMonths[1] = claimMonths[1] + ' 2021';
        } else {
          claimMonths[0] = claimMonths[0] + ' 2021';
          claimMonths[1] = claimMonths[1] + ' 2021';
        }
        return claimMonths;
      }

      //update the employee wages summary when the arms length value is changed
      $(document).on("change", "select[id^='arms-']", function (event) {
        //get the employee number
        var target = event.target;
        var id = target.id.split('-')[1];
        //trigger the blur event on all the inputs for the employees wages to recalculate
        $("#wkone-" + id).blur();
        $("#wktwo-" + id).blur();
        $("#wkthree-" + id).blur();
        $("#wkfour-" + id).blur();
      });
      //update the employee wage summary when the baseline value is changed
      $(document).on("blur", "input[id^='baseline-']", function (event) {
        //get the employee number
        var target = event.target;
        var id = target.id.split('-')[1];
        //trigger the blur event on all the inputs for the employees wages to recalculate
        $("#wkone-" + id).blur();
        $("#wktwo-" + id).blur();
        $("#wkthree-" + id).blur();
        $("#wkfour-" + id).blur();
      });

      /**
       * run the blur event for the wage input when the corresponding leave 
       * with pay option is checked
       */
      $(document).on("click", ".emp-lv > *", function (event) {
        leaveWithPayStateChanged(event);
      });
      function leaveWithPayStateChanged(event) {
        var target = null;
        //keypress event will send the checkbox as the event target
        if (event.target.nodeName == 'INPUT') {
          target = $("label[for='" + event.target.id + "']");
        } else {
          target = event.target;
        }
        var forValue = $(target).attr("for");
        var parts = forValue.split('-');
        var wageInputId = parts[0] + '-' + parts[2];
        $("#" + wageInputId).blur();
      }

      //send data to fields in 2B (need to add French text)
			
     //Changed to target NEXT button instead of push to 2b button (might not be needed);
			$(document).on("click", ".steps-wrapper:nth-child(4) button:contains('Next')", function (event) {
        calculateTotals();
      });
      $(document).on("click", ".steps-wrapper:nth-child(4) button:contains('Suivant')", function (event) {
        calculateTotals();
      });


      $(document).on("blur", "#p2c-ee-alt2", function(event) {
        if (event.target.value == 0) {
          $("#p3-ei").prop("readonly", true);
          $("#p3-ei").val("0.00");
          $("#p3-cpp").prop("readonly", true);
          $("#p3-cpp").val("0.00");
          $(".p3-ee-req").addClass("hidden");
          $(".no-lwp-disclaimer").removeClass("hidden");
        } else {
          $("#p3-ei").prop("readonly", false);
          $("#p3-ei").val("");
          $("#p3-cpp").prop("readonly", false);
          $("#p3-cpp").val("");
          $(".no-lwp-disclaimer").addClass("hidden");
          $(".p3-ee-req").removeClass("hidden");
        }
      });


	  //update percentage summary elements in 2B
      $(document).on("blur", "#p2b-c0", function (event) {
        $("output[for='p2b-c0']").text(toPercent(zeroIfEmpty(event.target.value)));
      });
      //update percentage summary elements in 2B 
      $(document).on("blur", "#p2b-c1", function (event) {
        $("output[for='p2b-c1']").text(toPercent(zeroIfEmpty(event.target.value)));
      });
      $(document).on("blur", "#p2b-c2", function (event) {
        $("output[for='p2b-c2']").text(toPercent(zeroIfEmpty(event.target.value)));
      });
      $(document).on("blur", "#p2b-c3", function (event) {
        $("output[for='p2b-c3']").text(toPercent(zeroIfEmpty(event.target.value)));
      });

      /**
       * getClaimMonth()
       * 
       * get the month where the claim period mostly falls
       * 
       * @param {Int} dateRange the claim period dates in 
       * YYYY-MM-DD--YYYY--MM-DD format
       * 
       * @return {Int} the claim month in numeric form 
       */
      var date1Max = 0;
      function getClaimMonth(dateRange) {
        var dates = dateRange.split('--');
        var date1Arr = dates[0].split("-");
        var date2Arr = dates[1].split("-");
        date1Arr[1] = date1Arr[1] - 1;
        date2Arr[1] = date2Arr[1] - 1;
        var date1 = new Date(Date.UTC(date1Arr[0], date1Arr[1], date1Arr[2]));
        var date2 = new Date(Date.UTC(date2Arr[0], date2Arr[1], date2Arr[2]));
        var date1Counter = 0;
        var date1Month = date1.getUTCMonth();
        var date2Counter = 0;
        var date2Month = date2.getUTCMonth();
        if (dateRange == "2020-12-20--2021-01-16") { //period 11/4 was arbitrarily defined differently from this rule...
          var claimMonth = date1Month + 1;
          return pad(claimMonth, 2);
        }
        if (date1Month == date2Month) {
          return date1Month + 1;
        }
        while (date1Month == date1.getUTCMonth()) {
          date1Counter++;
          date1.setUTCDate(date1.getUTCDate() + 1);
        }
        while (date2Month == date2.getUTCMonth()) {
          date2Counter++;
          date2.setUTCDate(date2.getUTCDate() - 1);
        }
        if (parseInt(date1Counter) < parseInt(date2Counter)) {
          return date2Month + 1;
        } else if (parseInt(date1Counter) > parseInt(date2Counter)) {
          return date1Month + 1;
        } else {
          return null;
        }
      }

      //https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
      function pad(num, size) {
        num = num.toString();
        while (num.length < size) num = "0" + num;
        return num;
      }

      /**
       * Calculate the top up rate
       * 
       * @param {Float} reduction the percentage average three month revenue 
       * reduction represented as a decimal
       *
       * @return {Float} the top up rate
       */
      function getP5PlusTopUpRate(reduction) {
        var claimPeriod = parseInt($("#claim-period option:selected").data("claim-period"));
        var topUpMultiplier = [1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.75, 1.75, 1.75, 1.75, 1.75, 1.75, 1.75, 1.25, 0.75, 0.5];
        var topUpMax = [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.35, 0.25, 0.15, 0.1];
        $('.scaleTopUp').text(topUpMultiplier[claimPeriod - 5]);
        if (topUpMultiplier[claimPeriod - 5] * (reduction - 0.5) > topUpMax[claimPeriod - 5]) {
          return topUpMax[claimPeriod - 5];
        } else {
          return topUpMultiplier[claimPeriod - 5] * (reduction - 0.5);
        }
      }

      /**
       * Calculate the base rate
       * @param {Float} revReduction the revenue reduction percentage 
       * represented as a decimal
       *  
       * @return {Float} the calculated base rate
       */
      function getP5PlusBaseRate(revReduction) {
        //max base and period for P5+
        var maxBase = [0.6, 0.6, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.35, 0.25, 0.1];
        var scaleBase = [1.2, 1.2, 1.0, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.875, 0.625, 0.25];
        var period = $("#claim-period option:selected").data("claim-period");
        $('.scaleBase').text(scaleBase[period - 5]);
        if (period > 17) {
          revReduction = revReduction - 0.1;
        }
        if (scaleBase[period - 5] * revReduction >= maxBase[period - 5]) {
          return maxBase[period - 5];
        } else {
          return scaleBase[period - 5] * revReduction;
        }
      }

      /**
       * Calculate the employee CEWS amount with the p1-4 formula
       *
       * @param {Boolean} armsLength whether the employee is at arms length
       * @param {Int} weeklyRemun the employees weekly pay being calculated
       * @param {Int} baselineRemun the employees baseline pre-crisis pay
       *
       * @return {Int} the calculated weekly CEWS amount 
       */
      function oldFormula(armsLength, weeklyRemun, baselineRemun) {
        if (armsLength) {
          return Math.max(
            Math.min(0.75 * weeklyRemun, 847),
            Math.min(0.75 * baselineRemun, weeklyRemun, 847)
          );
        } else {
          return Math.max(0, Math.min(847, weeklyRemun, baselineRemun * 0.75));
        }
      }

      /**
       * Calculate the employee cews amount with the P5+ formula
       *
       * @param {Boolean} armsLength whether the employee is at arms length
       * @param {Int} weeklyRemun the employees weekly pay being calculated
       * @param {Int} baselineRemun the employees baseline pre-crisis pay
       * @param {String} overall the overall CEWS rate 
       *  
       * @return {Int} the calculated weekly CEWS amount    
       */
      function newFormula(armsLength, weeklyRemun, baselineRemun, overall) {
        if (armsLength) {

          return Math.min(1129, weeklyRemun) * overall;
        } else {
          return Math.min(1129, weeklyRemun, baselineRemun) * overall;
        }
      }

      // Bind the init event of the plugin
      $document.on("timerpoke.wb " + initEvent, selector, init);
      // Add the timer poke to initialize the plugin
      wb.add(selector);
    })(jQuery, window, wb);
    $(document).on("wb-ready.wb", function () {
      $("#rate-reduction").addClass("hidden");
      $("#reduction-percent-panel").addClass("hidden");
    });
    // TODO: Escape commas and whitespaces in input[type=number] in IE and Edge(Trident)


    //fix for duplicated popup trigger
    $(document).on("click", ".arms-length-def", function (event) {
      showPopup("armslength");
    });
    $(document).on("click", ".baseline-rem-def", function (event) {
      showPopup("baseline-rem");
    });
    $(document).on("click", ".pay-claim-def", function (event) {
      showPopup("pay-claim");
    });
    $(document).on("click", ".toCSV", function (event) {
      export_table_to_csv("employee-cews.csv");
    });

    /**
     * export_table_to_csv
     *
     * https://jsfiddle.net/gengns/j1jm2tjx/
     */
    function export_table_to_csv(filename) {
      var csv = [];
      var rows = $("#dataset-filter tr");
      for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) {
          if (document.documentElement.lang == "fr") {
            var val = cols[j].innerText.replace(",", ".");
            val = val.replace(/,/g, ".")
            val = val.replace(/\s/g, "")
            row.push(val);
          } else {
            row.push(cols[j].innerText.replace(",", ""));
          }
        }

        csv.push(row.join(","));
      }
      // Download CSV
      download_csv(csv.join("\n"), filename);
    }
    /**
     * download_csv
     *
     * https://jsfiddle.net/gengns/j1jm2tjx/
     * 
     */
    function download_csv(csv, filename) {
      var csvFile;
      var downloadLink;

      // CSV FILE
      csv = "\uFEFF" + csv;
      csvFile = new Blob([csv], { type: "text/csv", encoding: "UTF-8" });

      // Download link
      downloadLink = document.createElement("a");

      // File name
      downloadLink.download = filename;

      // We have to create a link to the file
      downloadLink.href = window.URL.createObjectURL(csvFile);

      // Make sure that the link is not displayed
      downloadLink.style.display = "none";

      // Add the link to your DOM
      document.body.appendChild(downloadLink);

      // Lanzamos
      downloadLink.click();
    }

    /**
     * required to allow duplicated popup buttons to open the associated popup
     */
    function showPopup(id) {
      (function ($, wb) {
        'use strict';
        var $document = wb.doc;
        $document.trigger("open.wb-lbx", [
          [
            {
              src: "#" + id,
              type: "inline"
            }
          ],
          false
        ]);
      })(jQuery, wb);
    }

    $(document).on("blur", "input[id^='ee-name-']", function(event) {
      var className = $(event.target).prop("id");
      var empNumber = $(event.target).prop('id').split("-")[2];
      var displays = $("span." + className);
      var displayValue = "";
      if (empNumber > 0 && event.target.value == "") {
        displayValue = "Employee " + empNumber;
      } else {
        displayValue = event.target.value;
      }
      $(displays).each(function(i, element) {
        $(element).text(displayValue);
      });
    });
  </script> 
  <script>

      $(".action-checkbox").change(function () {
        if ($('.action-checkbox:checked').length == $('.action-checkbox').length) {
          $("#action-msg1").removeClass("hidden").addClass("visible");
          $("#action-no-msg").addClass("hidden").removeClass("visible");
        }
        if ($('.action-checkbox:checked').length !== $('.action-checkbox').length) {
          $("#action-msg1").addClass("hidden").removeClass("visible");
          $("#action-no-msg").removeClass("hidden").addClass("visible");
        }
      })
    </script>
  <script>

      $(".action-checkbox").change(function () {
        if ($('.action-checkbox:checked').length == $('.action-checkbox').length) {
          $("#action-msg1").removeClass("hidden").addClass("visible");
          $("#action-no-msg").addClass("hidden").removeClass("visible");
        }
        if ($('.action-checkbox:checked').length !== $('.action-checkbox').length) {
          $("#action-msg1").addClass("hidden").removeClass("visible");
          $("#action-no-msg").removeClass("hidden").addClass("visible");
        }
      })
    </script>