window.PTV = window.PTV || {};

window.PTV.getHeaderBrandContainer = function () {
  const header = document.querySelector(".skinHeader");
  if (!header) return null;

  return (
    header.querySelector(".headerBranding") ||
    header.querySelector(".headerLogo") ||
    header.querySelector(".pageTitleWithLogo") ||
    header.querySelector(".pageTitle")
  );
};

window.PTV.applyHeaderLogo = function () {
  const container = window.PTV.getHeaderBrandContainer();
  if (!container) return false;

  container.classList.remove("pageTitleWithLogo", "pageTitleWithDefaultLogo");
  container.classList.add("ptv-brand-replaced");
  container.setAttribute("aria-hidden", "true");

  let img = container.querySelector(".ptv-header-logo");

  if (!img) {
    container.replaceChildren();

    img = document.createElement("img");
    img.className = "ptv-header-logo";
    img.alt = "PiggieTV";
    img.decoding = "async";
    img.loading = "eager";

    container.appendChild(img);
  }

  if (img.getAttribute("src") !== window.PTV.config.LOGO_URL) {
    img.setAttribute("src", window.PTV.config.LOGO_URL);
  }

  return true;
};