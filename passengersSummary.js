// <script>
// $(function () {

/*
 * Combination of jQuery and vanila JS. jQuery used solely for even listeners
 * Main functionalify comes from the event trigger updateSummaryBox. There is an
 * update {true} and update {false}. Update {true} is used to update the summary
 * of the passengers (e.g. 4 passengers 2 rooms, economy).
 * Always include the script as RAW html notice <script> tags due to tranlation elements
 */
// ADD ARIA STUFF FOR DIVS
$(".summary-open-btn").attr({
  role: "button",
  tabindex: 0,
});
$(".summary-window").attr({
  role: "dialog",
});
// THIS WILL PREVENT BUTTONS FROM SUBMITING THE FORM
$(".summary-close-btn").attr("type", "button");
// ADD EVENT LISTENERS TO MAKE THEM WORK

$(".summary-open-btn").on("keydown", (e) => {
  if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
    $(e.target).click();
  }
});
// function to check if an element is visible
function isVisible(el) {
  return !el || el.style.display == "none" ? false : true;
}
$(document).on("updateSummaryBox", function (event, object, update) {
  if (!update) update = false;
  // Variables bellow have the scope for three types, supriseMe, rooms pax and pax only
  const summaryArea = object.closest(".summary-parent");
  const summaryBox = summaryArea.querySelector(".summary-box");
  const summaryWindow = summaryArea.querySelector(".summary-window");
  const numPax = summaryArea.querySelectorAll(".sb3_numpax_field_js");
  const numRooms = summaryArea.querySelector(".sb3_numrooms_field_js");
  const cabinClass = summaryArea.querySelector(".sb3_classofservice_field_js");
  let smPaxControls = document.querySelector(
    ".nbf_tpl_surpriseme_group_numadultsctrl, .nbf_tpl_surpriseme_group_numchildrenctrl, .nbf_tpl_surpriseme_group_numinfantsctrl"
  );
  if (smPaxControls)
    smPaxControls = smPaxControls.closest(".nbf_tpl_surpriseme_controls");

  // Total number of passengers
  let paxNo = 0;
  // Room numbers
  let roomNo = 0;
  let cabinClassText = "";
  let outputMsg = "";

  if (smPaxControls) {
    const smDropdowns = smPaxControls.querySelectorAll("select");
    for (const dropdown of smDropdowns) {
      paxNo = paxNo + parseInt(dropdown.value);
    }
  } else {
    if (numPax.length > 1) {
      for (const elem of numPax) {
        if (isVisible(elem.closest(".sb3_numrooms_pane_js"))) {
          paxNo = paxNo + parseInt(elem.value);
        }
      }
    } else paxNo = parseInt(numPax[0].value);
  }
  // If there are rooms create text based on that
  if (numRooms) {
    roomNo = numRooms.value;
    // % are translation elements 
    r = roomNo > 1 ? " %tr_tour_accommodation_roomsHeading%" : " %tr_room%";
    g =
      paxNo > 1
        ? " %tr_sb2NumberOfGuestsPlaceholder%, "
        : " %tr_profileGuestTravelerFirstName%, ";
    outputMsg = paxNo + g + roomNo + r;
  } else {
    g = paxNo > 1 ? " %tr_sb2Passengers%" : " %tr_passengerCap%";
    outputMsg = paxNo + g;
  }

  // If there is a cabin class dropdown add that in the output message
  if (cabinClass) {
    cabinClassText = summaryArea.querySelector(".sb3_classofservice_field_js")
      .selectedOptions[0].innerText;
    outputMsg = outputMsg + ", " + cabinClassText;
  }
  // If there are empty selections
  if ((numRooms && roomNo === 0) || paxNo === 0) {
    outputMsg = "Click for Options";
  }
  // Output a message
  summaryBox.innerHTML = outputMsg;
  // Remove the foccused status
  if (!update) {
    summaryBox.parentNode.classList.remove("sb3_focussed");
    // Hide the window
    $(summaryWindow).fadeOut(200);
  }
});

// Once the summary box is clicked then
$(document).on("click", ".summary-open-btn", function (e) {
  // If this has a listener then stop. A way to mitigate some event listener problems
  if (this.classList.contains("listenerActive")) return;
  const summaryArea = this.closest(".summary-parent");
  const summaryWindow = summaryArea.querySelector(".summary-window");
  // Bind this to this which came from the .summary-open-btn 
  const bindedFn = windowClose.bind(this);
  document.addEventListener("click", bindedFn);
  // The window is open add the listener is active
  this.classList.add("listenerActive");
  // if this is mobile then freeze the scroll (trigger, to avoid function dependencies)
  if (window.innerWidth <= 620) $(document).trigger("nbf:freezeScroll", { freeze: true });

  function windowClose(e) {
    // you will click outside of the window then
    if (
      e.target.closest(".summary-close-btn") !== null ||
      !summaryWindow.contains(e.target)
    ) {
      // if its mobile unfreeze the scroll
      if (window.innerWidth <= 620)
        $(document).trigger("nbf:freezeScroll", { freeze: false });
      document.removeEventListener("click", bindedFn);
      this.classList.remove("listenerActive");
      $(this).trigger("updateSummaryBox", [this, false]);
    }
  }

  $(this).parent().addClass("sb3_focussed").parent().find(".summary-window").fadeIn(200);
  e.stopPropagation();
});

// When the page loads update all of the summaries by triggering an event to the button
$(".summary-close-btn").each(function (i, elem) {
  $(document).trigger("updateSummaryBox", [elem, false]);
});
// });
// </script>
