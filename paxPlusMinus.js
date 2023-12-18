// This is used for the labels
function blurHandler(e) {
  if (!this.value && this.validity.badInput === false) {
    this.parentNode.classList.add("empty");
  } else this.parentNode.classList.remove("empty");
}
// This is used for the guest age
function guestsAgeHandler() {
  const returnField = this.parentNode.querySelector(".sb3_date_field_return");
  const formCtr = this.closest(".sb3_form");

  const guestLabel = formCtr.querySelectorAll(".dddd");

  for (const label of guestLabel) {
    label.innerHTML = returnField.value;
  }
}

let surpriseMePaxCtrl;

function updateIndicators(elem) {
  // Find surprise me controls in a page. Only a single surprise me control is allowed

  const indicatorParent = elem.parentNode;
  const type = elem.dataset.type;
  let passengerBox = elem.closest(".summary-parent");
  let maxNum;
  let minNum;

  if (type == "pax") {
    // if its room
    if (elem.closest(".sb3_numrooms_pane_js"))
      passengerBox = elem.closest(".sb3_numrooms_pane_js");

    // Find the selectbox
    dropdown = passengerBox.querySelector(".sb3_numpax_field_js");
  }
  if (type == "room") {
    dropdown = passengerBox.querySelector(".sb3_numrooms_field_js");
  }
  if (type === "numchildren" || type === "numadults" || type === "numinfants") {
    dropdown = surpriseMePaxCtrl.querySelector("select[name='" + type + "']");
  }

  if (dropdown === null) return;

  minNum = parseInt(dropdown.firstChild.value);
  maxNum = parseInt(dropdown.lastChild.value);

  const calculation = parseInt(dropdown.value);

  if (calculation === minNum) indicatorParent.querySelector(".minus-btn").disabled = true;
  if (calculation === maxNum) indicatorParent.querySelector(".plus-btn").disabled = true;

  elem.innerHTML = dropdown.value;
}
function plusMinusHandler(e) {
  const indicatorParent = this.parentNode;
  const numIndicator = indicatorParent.querySelector(".indicator");
  const type = numIndicator.dataset.type;
  const plusMinus = parseInt(this.value);
  let passengerBox = this.closest(".summary-parent");

  let maxNum;
  let minNum;
  let dropdown;

  // if it is passenger do
  if (type == "pax") {
    // if the passenger is within a room container
    if (this.closest(".sb3_numrooms_pane_js"))
      passengerBox = this.closest(".sb3_numrooms_pane_js");
    // Find the selectbox
    dropdown = passengerBox.querySelector(".sb3_numpax_field_js");
    // Find the min limit
  }
  if (type == "room") {
    dropdown = passengerBox.querySelector(".sb3_numrooms_field_js");
  }
  if (type === "numchildren" || type === "numadults" || type === "numinfants") {
    // Find surprise me controls in a page. Only a single surprise me control is allowed
    passengerBox = indicatorParent;
    // Find the selectbox
    dropdown = surpriseMePaxCtrl.querySelector("select[name='" + type + "']");
  }
  minNum = parseInt(dropdown.firstChild.value);
  maxNum = parseInt(dropdown.lastChild.value);

  const calculation = parseInt(dropdown.value) + plusMinus;

  indicatorParent.querySelector(".minus-btn").disabled = false;
  indicatorParent.querySelector(".plus-btn").disabled = false;

  if (calculation === minNum) indicatorParent.querySelector(".minus-btn").disabled = true;
  if (calculation === maxNum) indicatorParent.querySelector(".plus-btn").disabled = true;

  const indicator = passengerBox.querySelector(".indicator");
  if (indicator) indicator.innerHTML = calculation;
  $(dropdown).val(calculation).trigger("change");
}

// Searchbox Init function used for Add-prod
function searchboxInit() {
  surpriseMePaxCtrl = document.querySelector(
    ".nbf_tpl_surpriseme_group_numadultsctrl, .nbf_tpl_surpriseme_group_numchildrenctrl, .nbf_tpl_surpriseme_group_numinfantsctrl"
  );
  if (surpriseMePaxCtrl)
    surpriseMePaxCtrl = surpriseMePaxCtrl.closest(".nbf_tpl_surpriseme_controls");
  // Set the date picker to read-only, prevent screen keyboard
  $(".sb3_form .hasDatepicker, .nbf_tpl_surpriseme_filter_departuremonth input").attr(
    "readonly",
    "readonly"
  );

  // SB3 Label: placeholders-to-label transition
  const textBoxes = document.querySelectorAll(".sb3_textbox");
  for (const element of textBoxes) {
    if (element.value === "") element.parentNode.classList.add("empty");
    element.addEventListener("blur", blurHandler);
    $(element).on("change", blurHandler);
  }
  // Guest ages on XXXXXX part
  const returnFields = document.querySelectorAll(".sb3_input_returnDate");

  for (const element of returnFields) {
    if (element.classList.contains("guestAgeOnTravel-initialized")) continue;
    guestsAgeHandler.apply(element);

    $(element).on("change", guestsAgeHandler);
    element.classList.add("guestAgeOnTravel-initialized");
  }

  // For each number handle do
  const numHandle = document.querySelectorAll(".sb3NumHandle");
  for (const element of numHandle) {
    // if the number handle initialized dont run
    if (element.classList.contains("numberHandle-initialized")) continue;

    $(element).on("click", plusMinusHandler);
    $(element).on("click", function () {
      $(document).trigger("updateSummaryBox", [this, true]);
    });
    element.classList.add("numberHandle-initialized");
  }

  $(".sb3_classofservice_field_js").on("change", function () {
    $(document).trigger("updateSummaryBox", [this, true]);
  });

  // For each indicator
  const indicators = document.querySelectorAll(".indicator");
  for (const indicator of indicators) {
    if (indicator.classList.contains("indicator-initialized")) continue;
    updateIndicators(indicator);
    // add a class to initialize
    indicator.classList.add("indicator-initialized");
  }
}

$(function () {
  // SELECT NEXT DAY AFTER A SELECT IS CLICKED
  $(document).on("datepickeronselect", function (e, dateText, inst) {
    const inputUsed = inst.input[0];
    const nextInput = inputUsed
      .closest(".sb3_form")
      .querySelector(".sb3_date_field_return");

    if (
      !inputUsed.classList.contains("sb3_date_field_return") &&
      !nextInput.disabled &&
      window.innerWidth > 720
    ) {
      setTimeout(function () {
        // set a timeout because this causes issues
        nextInput.focus();
      }, 500);
    }
  });

  searchboxInit();

  $(document).on(
    "BF_Slidepanel_Open BF_Slidepanel_UpdateContent",
    function (e, slidepanel) {
      // if the pannel is not a sb3_form dont run
      if (!slidepanel.find(".sb3_form").length) return;

      $(".summary-close-btn").each(function (i, elem) {
        $(document).trigger("updateSummaryBox", [elem, false]);
      });

      searchboxInit();
    }
  );
});
