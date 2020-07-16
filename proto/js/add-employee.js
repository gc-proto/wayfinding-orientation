
var Employee = (function () {
  var weekly = 1;
  var biWeekly = 2;
  var weeklyPrefix = "wkly-";
  var biWeeklyPrefix = "bwkly-";
  var weeklyTemplateId = weeklyPrefix +"emp-1";
  var biWeeklyTemplateId = biWeeklyPrefix+ "emp-1";
  var armsLengthId = "arms";
  var baselineId = "baseline"

  /**
   * Employee()
   * Constructor
   * @param {Int} paySchedule the numeric value of the chosen pay schedule
   */
  function Employee(paySchedule) {
    this.paySchedule = paySchedule;
    this.updateTemplateId();
    this.numberOfEmployees = 1;
  }

  /**
   * 
   */
  Employee.prototype.generateNewEmployeeForm = function() {
    if (this.paySchedule == weekly) {
      //update number of employee frames
      this.numberOfEmployees++;
      //generate another weekly pay template
      return this.newWeeklyTemplate();
    } else if (this.paySchedule == biWeekly) {
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
   * @param {*} newPaySchedule 
   */
  Employee.prototype.updatePaySchedule = function(newPaySchedule) {
    this.paySchedule = newPaySchedule;
  }

  /**
   * 
   */
  Employee.prototype.newBiWeeklyTemplate = function() {
    var frag = document.getElementById(this.templateId);
  }
  
  /**
   * 
   */
  Employee.prototype.newWeeklyTemplate = function() {
    var frag = document.getElementById(this.templateId);

  }

  /**
   * 
   */
  Employee.prototype.updateTemplateId = function() {
    if (this.paySchedule == weekly) {
      this.templateId = weeklyTemplateId;
    } else {
      this.templateId = biWeeklyTemplateId;
    }
  }

  /**
   * 
   * @param {*} frag 
   */
  Employee.prototype.updateArmsLengthElementId = function(frag) {
    var armsLengthElement = frag.getElementById(
      this.templateId + this.armsLengthId + this.numberOfEmployees
    );
    armsLengthElement.id = this.templateId + this.armsLengthElement + (this.numberOfEmployees + 1)
  }

  /**
   * 
   * @param {*} frag 
   */
  Employee.prototype.updateArmsLengthElementId = function(frag) {
    var baselineWageElement = frag.getElementById(
      this.templateId + this.baselineId + this.numberOfEmployees
    );
    baselineWageElement.id = this.templateId + this.baselineId + (this.numberOfEmployees + 1)
  }
})
