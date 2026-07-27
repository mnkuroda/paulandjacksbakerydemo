(function () {
  "use strict";

  var feed = document.getElementById("instagram-feed");
  if (!feed) {
    return;
  }

  var track = feed.querySelector(".instagram-feed-track");
  var dotsContainer = feed.querySelector(".instagram-feed-dots");
  if (!track || !dotsContainer) {
    return;
  }

  var items = Array.from(track.querySelectorAll(".instagram-feed-item"));
  var currentPage = 0;
  var gap = 10;

  function getItemsPerPage() {
    if (window.innerWidth < 600) {
      return 1;
    }
    if (window.innerWidth < 900) {
      return 3;
    }
    return 4;
  }

  function getPageCount(itemsPerPage) {
    return Math.max(1, Math.ceil(items.length / itemsPerPage));
  }

  function updateCarousel() {
    var itemsPerPage = getItemsPerPage();
    var pageCount = getPageCount(itemsPerPage);

    if (currentPage >= pageCount) {
      currentPage = pageCount - 1;
    }
    if (currentPage < 0) {
      currentPage = 0;
    }

    var viewport = track.parentElement;
    var viewportWidth = viewport.getBoundingClientRect().width;
    var itemWidth = (viewportWidth - gap * (itemsPerPage - 1)) / itemsPerPage;
    var offset = currentPage * itemsPerPage * (itemWidth + gap);

    items.forEach(function (item) {
      item.style.width = itemWidth + "px";
      item.style.flexBasis = itemWidth + "px";
    });

    track.style.transform = "translate3d(" + -offset + "px, 0, 0)";
    renderDots(pageCount);
  }

  function renderDots(pageCount) {
    dotsContainer.innerHTML = "";

    for (var i = 0; i < pageCount; i++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "instagram-feed-dot" + (i === currentPage ? " is-active" : "");
      dot.setAttribute("aria-label", "Show Instagram posts page " + (i + 1));
      dot.setAttribute("aria-current", i === currentPage ? "true" : "false");

      dot.addEventListener("click", function (pageIndex) {
        return function () {
          currentPage = pageIndex;
          updateCarousel();
        };
      }(i));

      dotsContainer.appendChild(dot);
    }
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateCarousel, 120);
  });

  updateCarousel();
})();
