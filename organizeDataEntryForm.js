function organizeDataEntryForm() {
  /*==================================================*/
  /*================DATA ENTRY FORMS==================*/
  /*==================================================*/
  // Unwrap an element
function unwrapElement(element) {
  // get the element's parent node
  let parent = element.parentNode;
  // move all children out of the element
  while (element.firstChild) parent.insertBefore(element.firstChild, element);
  // remove the empty element
  parent.removeChild(element);
}
function validateField(inputField) {
  let value = inputField.val(); // Get the value of the input field
  let inputType = inputField.prop("type"); // Get the type of the input field
  let emailReg = /^([\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4})+$/; // Regex to Validate Mail
  let phoneReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[\-\s\.\/0-9]*$/g; // Regex to Validate Number
  
  // If Mail validate and return
  if ((inputType === "email")) return emailReg.test(value);
  // If number validate and return
  if ((inputType === "number")) return phoneReg.test(value);
  // If there is anything else then just check if there is a value and if its required
  return inputField.prop("required") && value ? true : false;
}

// This will remove the error messages and add green class
function validationFeedback(_this) {
  let input = $(_this);
  if (validateField(input)) {
    input.addClass("green");
    if (input.next().length) {
      input.next().remove();
    }
  } else {
    input.removeClass("green");
  }
  input = input[0];
  if (!input.value && input.validity.badInput === false) {
    input.parentNode.classList.remove('notEmpty');
  } else input.parentNode.classList.add('notEmpty');
}

// Select the data entry forms
const dataEntryForms = document.getElementsByClassName(
  "nbf_tpl_dataentryform_ajax"
);

/* ===== RUN DATA ENTRY FORM FUNCTIONS ===== */
/*=============================================================================
  * Input fields which are required or are coloured red will turn green if      *
  * The input has text for input, is an email for emails or is a phone          *
  ==============================================================================*/

 

/*==============================================================================
    * Following lines bellow will sort out the data entry forms by adding IDs and  *
    * changing the HTML markup eventually ending any styling nightmare.            *
    ============================================================================== */
for (var i = 0; i < dataEntryForms.length; i++) {
  if (dataEntryForms[i].classList.contains("organized")) continue;
  
  const _selector = "#" +
    dataEntryForms[i].id +
    " input, #" +
    dataEntryForms[i].id +
    " select, #" +
    dataEntryForms[i].id +
    " textarea";
  $(_selector).on("blur", function(){
    validationFeedback(this);
  });
  
  // Hide the form to avoid browser stress
  dataEntryForms[i].style.visibility = "hidden";
  var _span = document.createElement("span")["outerHTML"];
  //Remove the Browser Validation
  dataEntryForms[i].setAttribute("novalidate", "novalidate");
  //Add classes to style the   elements
  dataEntryForms[i].classList.add("textbox-simple");
  dataEntryForms[i].classList.add("selectbox-simple");
  dataEntryForms[i].classList.add("organized");

  // Add the Default button-main
  let submitButton = dataEntryForms[i].getElementsByClassName(
    "nbf_tpl_dataentryform_field_cont_submit"
  );
  submitButton[0].firstChild.classList.add("button-main");

  // Get all the containers within that form
  var containers = document.querySelectorAll(
    "#"+dataEntryForms[i].id+ " .nbf_tpl_dataentryform_field_cont"
  );
  // For each container DO
  for (let i = 0; i < containers.length; i++) {
    // Get the child Nodes
    var containerChildren = containers[i].childNodes;
    // For each Child node make a check
    for (let i = 0; i < containerChildren.length; i++) {
      // If it is a title or description convert it into an id and set it to its parent.
      if (
        containerChildren[i] !== undefined &&
        containerChildren[i].tagName === "DIV"
      ) {
        if (
          containerChildren[i].classList.contains("description") ||
          containerChildren[i].classList.contains("title")
        ) {
          let containerId = containerChildren[i].textContent
            .replace(/\s/g, "-")
            .toLowerCase();
          containerId = containerId.replace(/[^a-z-0-9]+/gi, "");
          containerChildren[i].parentNode.setAttribute("id", containerId);
        }
        // If it is just a div unwrap it
        if (
          containerChildren[i].id === "" &&
          containerChildren[i].classList.length === 0
        ) {
          unwrapElement(containerChildren[i]);
        }
      }
    }
  }
  // Clean up duplicate ids and add classes
  for (let i = 0; i < containers.length; i++) {
    if (containers[i].id !== "") {
      let x = 0;
      let duplicateIds = document.querySelectorAll("#" + containers[i].id);
      if (duplicateIds.length > 1) {
        while (x < duplicateIds.length) {
          duplicateIds[x].classList.add(duplicateIds[x].id);
          duplicateIds[x].setAttribute("id", duplicateIds[x].id + "-" + x);
          x++;
        }
      }
    }
  }
  // Display the form after all the fix
  dataEntryForms[i].style.visibility = "";
}

}
