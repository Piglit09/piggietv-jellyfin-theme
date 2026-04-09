window.PTV = window.PTV || {};

window.PTV.getSidebarContainer = function () {
  return (
    document.querySelector(".mainDrawer .navMenu") ||
    document.querySelector(".mainDrawer .drawerContent") ||
    document.querySelector(".mainDrawer .itemsContainer") ||
    document.querySelector(".mainDrawer-scrollContainer")
  );
};

window.PTV.applySidebarLogo = function () {
  const container = window.PTV.getSidebarContainer();
  if (!container) return false;

  let wrap = document.getElementById("ptv-sidebar-logo");

  if (wrap && wrap.parentElement !== container) {
    wrap.remove();
    wrap = null;
  }

  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "ptv-sidebar-logo";

    const img = document.createElement("img");
    img.className = "ptv-sidebar-logo-img";
    img.alt = "PiggieTV";
    img.decoding = "async";
    img.loading = "eager";

    wrap.appendChild(img);
    container.prepend(wrap);
  }

  const img = wrap.querySelector(".ptv-sidebar-logo-img");
  if (img && img.getAttribute("src") !== window.PTV.config.LOGO_URL) {
    img.setAttribute("src", window.PTV.config.LOGO_URL);
  }

  return true;
};

window.PTV.runGlobalBranding = function () {
  window.PTV.applyHeaderLogo();
  window.PTV.applySidebarLogo();
};