// Create object to store scroll position and fn
let _ibeNoScroll = {
  variables: {
    scrollPos: 0,
  },
  noScroll: function (_this, params) {
    // If can take params to freeze or unfreeze scroll for better control
    // If there would be no param it will detect if there is scroll freeze
    // In place and toggle it.
    let freeze;
    const bodyStyle = window.getComputedStyle(document.body);
    params = params || {};
    params.hasOwnProperty("freeze")
      ? (freeze = params.freeze)
      : (freeze = bodyStyle.getPropertyValue("position") !== "fixed");
    const dbStyle = document.body.style;
    if (freeze) {
      // Freeze Scroll
      this.variables.scrollPos = -window.scrollY;
      dbStyle.position = "fixed";
      dbStyle.overflow = "hidden";
      dbStyle.top = this.variables.scrollPos + "px";
      dbStyle.left = 0;
      dbStyle.right = 0;
      dbStyle.bottom = 0;
      return;
    }
    if (!freeze) {
      // Unfreeze Scroll
      dbStyle.position = "";
      dbStyle.overflow = "";
      dbStyle.top = "";
      dbStyle.left = "";
      dbStyle.right = "";
      dbStyle.bottom = "";
      if (this.variables.scrollPos) window.scrollTo(0, -this.variables.scrollPos);
      this.variables.scrollPos = 0;
    }
  },
  init: function () {
    _this = this;
    $(document).on("nbf:freezeScroll", this.noScroll.bind(this));
  },
};

$(function () {
  // Run init on dom ready
  _ibeNoScroll.init();
});
