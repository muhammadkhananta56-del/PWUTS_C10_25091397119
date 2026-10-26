(function ($) {
  "use strict";
  const $main = $("#main-content");
  const homeMarkup = $main.html();
  const pageTitles = {
    "pages/beranda.html": "Beranda — Step Clean",
    "pages/layanan.html": "Layanan & Harga — Step Clean",
    "pages/booking.html": "Booking — Step Clean",
    "pages/tracking.html": "Cek Pesanan — Step Clean"
  };

  function showToast(message) {
    const $toast = $("#global-toast");
    if (!$toast.length) return;
    $toast.text(message).addClass("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => $toast.removeClass("show"), 3000);
  }

  function updateActiveNav(page) {
    $(".nav-link").removeClass("active").each(function () {
      if ($(this).attr("data-page") === page) $(this).addClass("active");
    });
  }

  function initPageScripts(page) {
    if (page === "pages/booking.html" && window.StepCleanBooking) window.StepCleanBooking.init();
    if (page === "pages/tracking.html" && window.StepCleanTracking) window.StepCleanTracking.init();
    $main.attr("tabindex", "-1").trigger("focus");
  }

  function loadPage(page, pushState) {
    if (!page) return;
    if (page === "index.html" || page === "./") {
      $main.html(homeMarkup);
      document.title = "Step Clean — Booking Cuci Sepatu";
      updateActiveNav("pages/beranda.html");
      initPageScripts("pages/beranda.html");
      if (pushState) history.pushState({ page: "index.html" }, "", "index.html");
      return;
    }
    $main.attr("aria-busy", "true");
    $.ajax({ url: page, method: "GET", dataType: "html", cache: true, timeout: 10000 })
      .done(function (markup) {
        $main.html(markup);
        $main.attr("aria-busy", "false");
        document.title = pageTitles[page] || "Step Clean";
        updateActiveNav(page);
        if (pushState) history.pushState({ page: page }, "", page);
        initPageScripts(page);
      })
      .fail(function () {
        $main.attr("aria-busy", "false");
        showToast("Halaman tidak dapat dimuat. Jalankan proyek melalui server lokal dan coba lagi.");
      });
  }

  $(document).on("click", "a[data-page]", function (event) {
    const page = $(this).attr("data-page");
    if (!page) return;
    event.preventDefault();
    $(".main-nav").removeClass("open");
    $(".nav-toggle").attr("aria-expanded", "false").text("☰");
    loadPage(page, true);
  });

  $(".nav-toggle").on("click", function () {
    const open = !$(".main-nav").hasClass("open");
    $(".main-nav").toggleClass("open", open);
    $(this).attr("aria-expanded", String(open)).text(open ? "×" : "☰");
  });

  window.addEventListener("popstate", function (event) {
    const page = (event.state && event.state.page) || location.pathname.split("/").slice(-2).join("/");
    if (page === "index.html" || location.pathname.endsWith("/")) {
      $main.html(homeMarkup);
      document.title = "Step Clean — Booking Cuci Sepatu";
      updateActiveNav("pages/beranda.html");
      return;
    }
    loadPage(page, false);
  });

  $("#year").text(new Date().getFullYear());
  // A fresh load of index.html starts at the homepage. Navigation links then use AJAX.
  // AJAX is verified only when tested on a local PHP/HTTP server, not by opening file://.
})(jQuery);
