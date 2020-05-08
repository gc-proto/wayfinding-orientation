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

function updateChecklistReady() {
  if ($("[role='checkbox'][aria-checked='true']").length === $("[role='checkbox']").length) {
    $("#action-msg-all").removeClass("invisible");
  }
  if ($("[role='checkbox'][aria-checked='true']").length !== $("[role='checkbox']").length) {
    $("#action-msg-all").addClass("invisible");
  } 
};