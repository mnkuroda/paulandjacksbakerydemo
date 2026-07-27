(function () {
  "use strict";

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("is-open", !isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
      });
    });
  }

  function getEasternTimeParts(date) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    });

    const parts = formatter.formatToParts(date);
    const values = {};

    parts.forEach(function (part) {
      if (part.type !== "literal") {
        values[part.type] = part.value;
      }
    });

    return {
      weekday: values.weekday,
      hour: Number(values.hour),
      minute: Number(values.minute)
    };
  }

  function isOpenNow(date) {
    const { weekday, hour, minute } = getEasternTimeParts(date);
    const time = hour + minute / 60;
    const isWeekend = weekday === "Fri" || weekday === "Sat" || weekday === "Sun";
    const openHour = 7;
    const closeHour = isWeekend ? 20 : 18;

    return time >= openHour && time < closeHour;
  }

  function updateOpenStatus() {
    const dot = document.getElementById("open-status-dot");
    const text = document.getElementById("open-status-text");

    if (!dot || !text) {
      return;
    }

    const open = isOpenNow(new Date());

    dot.classList.toggle("is-open", open);
    dot.classList.toggle("is-closed", !open);
    text.textContent = open ? "Open now · Mon–Thu 7am–6pm, Fri–Sun 7am–8pm" : "Closed now · Opens daily at 7am";
  }

  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);
})();
