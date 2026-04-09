window.PTV = window.PTV || {};

window.PTV.init = function () {
  if (!document.body) return;

  window.PTV.setBodyReadyFlag();

  window.PTV.schedule("branding", () => {
    window.PTV.runGlobalBranding();
  });

  window.PTV.schedule("login", () => {
    window.PTV.runLoginEnhancements();
  });

  window.PTV.schedule("home-backdrop", () => {
    window.PTV.runHomeBackdropEnhancement();
  });

  window.PTV.bindEnterPulse();
  window.PTV.bindBackgroundHover();
  window.PTV.observeApp();

  window.PTV.log("custom.js loaded");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.PTV.init, { once: true });
} else {
  window.PTV.init();
}