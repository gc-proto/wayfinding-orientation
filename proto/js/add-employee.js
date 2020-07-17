
var EmployeeFormGenerator = (function () {
  

  /**
   * Employee()
   * Constructor
   * @param {Int} paySchedule the numeric value of the chosen pay schedule
   */
  function EmployeeFormGenerator(paySchedule) {
    this.paySchedule = paySchedule;
    this.updateTemplateId();
    this.numberOfEmployees = 1;
    this.weekly = 1;
    this.biWeekly = 2;
    this.weeklyPrefix = "wkly-";
    this.biWeeklyPrefix = "bwkly-";
    this.weeklyTemplateId = this.weeklyPrefix +"emp-1";
    this.biWeeklyTemplateId = this.biWeeklyPrefix+ "emp-1";
    this.armsLengthId = "arms";
    this.baselineId = "baseline"
  }

  /**
   * 
   */
  EmployeeFormGenerator.prototype.generateNewEmployeeForm = function() {
    if (this.paySchedule == this.weekly) {
      //generate another weekly pay template
      var newTemplate =  this.newWeeklyTemplate();
      this.numberOfEmployees++;
      //update number of employee frames
      return newTemplate;
    } else if (this.paySchedule == this.biWeekly) {
      //generate another bi-weekly pay template
      var newTemplate = this.newBiWeeklyTemplate();
      //update number of employee frames
      this.numberOfEmployees++;
      return newTemplate;
    } else {
      //clear all employee data? check with designers
    }
  }

  /**
   * 
   * @param {Int} newPaySchedule 
   */
  EmployeeFormGenerator.prototype.updatePaySchedule = function(newPaySchedule) {
    this.paySchedule = newPaySchedule;
    this.updateTemplateId();
  }

  /**
   * 
   */
  EmployeeFormGenerator.prototype.newBiWeeklyTemplate = function() {
    var frag = document.getElementById(this.templateId);
    frag = $(frag).clone(true,true);
    $(frag).attr("id", $(frag).attr("id").replace("-1", "-" + (this.numberOfEmployees + 1)))
    this.updateArmsLengthElementId(frag);
    this.updateBaselineWageElementId(frag);
    this.setUpdatesAndUpdatedByData(frag);
    return frag;
  }
  
  /**
   * 
   */
  EmployeeFormGenerator.prototype.newWeeklyTemplate = function() {
    var frag = document.getElementById(this.templateId);
    //clone the document fragment, with all children, and all attributes
    frag = $(frag).clone(true, true);
    $(frag).attr("id", $(frag).attr("id").replace("-1", "-" + (this.numberOfEmployees + 1)))
    this.updateArmsLengthElementId(frag);
    this.updateBaselineWageElementId(frag);
    this.setUpdatesAndUpdatedByData(frag);
    this.updateInputIds(frag);
    return frag;
  }

  /**
   * 
   */
  EmployeeFormGenerator.prototype.updateTemplateId = function() {
    if (this.paySchedule == this.weekly) {
      this.templateId = this.weeklyTemplateId;
    } else {
      this.templateId = this.biWeeklyTemplateId;
    }
  }

  /**
   * 
   * @param {DOMDocumentFragment} frag 
   */
  EmployeeFormGenerator.prototype.updateArmsLengthElementId = function(frag) {
    var armsLengthElement = $(frag).find(
      "#" + this.templateId + this.armsLengthId + this.numberOfEmployees
    );
    console.debug( "#" + this.templateId + this.armsLengthId + this.numberOfEmployees);
    $(armsLengthElement).attr("id", $(armsLengthElement).attr("id").replace(/-1$/g, "-" + (this.numberOfEmployees + 1)));
  }

  /**
   * 
   * @param {DOMDocumentFragment} frag 
   */
  EmployeeFormGenerator.prototype.updateBaselineWageElementId = function(frag) {
    var baselineWageElement = $(frag).find(
      "#" + this.templateId + this.baselineId + this.numberOfEmployees
    );
    $(baselineWageElement).attr("id", $(baselineWageElement).attr("id").replace(/-1$/g, "-" + (this.numberOfEmployees + 1)));
  }

  /**
   * 
   * @param {DOMDocumentFragment} frag 
   */
  EmployeeFormGenerator.prototype.setUpdatesAndUpdatedByData = function(frag) {
    var updateElements = $(frag).find("*[data-updates]");
    var updatedByElements = $(frag).find("*[data-updated-by]");
    $(updateElements).each(function(i, element) {
      $(element).data("updates").replace(/-1$/g, "-" + (this.numberOfEmployees + 1));
    });
    $(updatedByElements).each(function(i, element) {
      $(element).data("updated-by").replace(/-1$/g, "-" + (this.numberOfEmployees + 1));
    });
  }

  /**
   * 
   * @param {DOMDocumentFragment} frag 
   */
  EmployeeFormGenerator.prototype.updateInputIds = function(frag) {
    var inputs = $(frag).find("input[id=$'-1']");
    $(inputs).each(function(i, element) {
      $(element).attr("id", $(element).attr("id").replace(/-1$/g, "-" + (this.numberOfEmployees + 1)));
    });
  }

  return EmployeeFormGenerator;
})();
