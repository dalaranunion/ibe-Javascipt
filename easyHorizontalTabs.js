/*
 ** This script is for the tabbed containers. When a container
 ** is scrollable and user clicks the container will be scrolled
 ** in the middle of the screen.
 */

// Get all containers within the page
const tabs = document.querySelectorAll(".sb3_tabs .nbf_tpl_pagesection_tabs li");

function clickHandler(e) {
  // Get the currentTarget e.g li element
  const elClicked = e.currentTarget;
  const elemParent = elClicked.parentNode;
  const elScrollWidth = elemParent.scrollWidth;
  const elWidth = elemParent.offsetWidth;
  // Check if the container is scrollable
  if (elScrollWidth <= elWidth) return;
  // Parent's width minus clicked elements width divided by two, returns
  // the space left/right. Then minus the position relative to the parent
  const positionCalc =
    elClicked.offsetLeft - (elClicked.parentNode.offsetWidth - elClicked.offsetWidth) / 2;
  // Scroll the container based on the calculation above
  $(elClicked.parentNode).animate({ scrollLeft: positionCalc }, 200);
}

// For each li button
for (let i = 0; i < tabs.length; i++) {
  const tab = tabs[i];
  // Attach the event listener
  tab.addEventListener("click", clickHandler);
}
$(".sb3_tabs .nbf_tpl_pagesection_tabselected").trigger("click");
