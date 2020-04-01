/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   ChecklistReady.js
*
*   Desc:   Checklist add-on that implements ARIA Authoring Practices
*           for a validation message enable by a set of values
*
*/

Checkbox.prototype.anyLastChecked = function () {
  var count = 0;
  for (var i = 0; i < this.controlledCheckboxes.length; i++) {
    if (this.controlledCheckboxes[i].lastState) {
      count++;
    }
  }
  return count > 0;
};

Checkbox.prototype.toggleCheckbox = function () {

  if (this.domNode.getAttribute('aria-checked') === 'true') {
    this.setControlledCheckboxes('false')
  }
  else {
    if (this.anyLastChecked()) {
      this.setControlledCheckboxes('last');
    }
    else {
      this.setControlledCheckboxes('true');
    }
  }
  this.updateChecklistReady();
};

Checkbox.prototype.updateChecklistReady = function () {
  var checkedCount = 0;
  var alert = document.getElementById('action-msg-all');
  var checkboxes = document.querySelectorAll('[role="checkbox"]');

  for (var i = 0; i < this.controlledCheckboxes.length; i++) {
    if (this.controlledCheckboxes[i].isChecked()) {
      checkedCount++;
    }
  }

  if (checkedCount !== checkboxes.length) {
    alert.classList.add('invisible');
  }
  else {
    alert.classList.remove('invisible');
  }
}

Checkbox.prototype.setControlledCheckboxes = function (value) {

  for (var i = 0; i < this.controlledCheckboxes.length; i++) {
    this.controlledCheckboxes[i].setChecked(value);
  }

  this.updateChecklistReady();

};
