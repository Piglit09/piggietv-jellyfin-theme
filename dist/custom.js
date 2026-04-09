(function () {
  "use strict";

  const LOG_PREFIX = "[PiggieTV]";
  const LOGO_URL = "https://theme.piggietv.com/assets/logo/banner-light.png";
  const DISCORD_URL = "https://discord.gg/FbtexGYau";

  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }

  function setBodyReadyFlag() {
    document.body.classList.add("ptv-loaded");
  }

  function injectLoginHeader() {
    const form = document.querySelector("#loginPage .manualLoginForm");
    if (!form || document.getElementById("ptv-login-header")) return;

    const header = document.createElement("div");
    header.id = "ptv-login-header";
    header.innerHTML = `
      <img src="${LOGO_URL}" class="ptv-login-logo" alt="PiggieTV">
      <div class="ptv-login-tagline">MOVIES • TV SHOWS • ANIME</div>
    `;

    form.prepend(header);
    log("login header injected");
  }

  function injectLoginButtons() {
    const form = document.querySelector("#loginPage .manualLoginForm");
    if (!form || document.getElementById("ptv-login-actions")) return;

    const submitBtn =
      form.querySelector('button[type="submit"]') ||
      form.querySelector(".button-submit") ||
      form.querySelector(".emby-button.submit") ||
      form.querySelector(".emby-button.button-submit");

    if (!submitBtn) {
      log("submit button not found yet");
      return;
    }

    const quickBtn = document.querySelector("#loginPage .btnQuick");
    const forgotBtn = document.querySelector("#loginPage .btnForgotPassword");

    const actions = document.createElement("div");
    actions.id = "ptv-login-actions";
    actions.innerHTML = `
      <button type="button" class="emby-button block ptv-login-action ptv-secondary" data-ptv-action="signup">
        Sign Up
      </button>
      <button type="button" class="emby-button block ptv-login-action ptv-secondary" data-ptv-action="forgot">
        Forgot Password
      </button>
      <button type="button" class="emby-button block ptv-login-action ptv-secondary" data-ptv-action="quick">
        Use Quick Connect
      </button>
      <a class="emby-button block ptv-login-action ptv-discord"
         data-ptv-action="discord"
         href="${DISCORD_URL}"
         target="_blank"
         rel="noopener noreferrer">
        Discord
      </a>
    `;

    submitBtn.insertAdjacentElement("afterend", actions);

    actions.addEventListener("click", (event) => {
      const target = event.target.closest("[data-ptv-action]");
      if (!target) return;

      const action = target.getAttribute("data-ptv-action");

      if (action === "signup") {
        window.open("https://signup.piggietv.com/invite/ysBDoDSMpv5fFMz9GPMxUL", "_blank");
        return;
      }

      if (action === "forgot") {
        if (forgotBtn) forgotBtn.click();
        return;
      }

      if (action === "quick") {
        if (quickBtn) quickBtn.click();
        return;
      }
    });

    log("login buttons injected");
  }

  function runLoginEnhancements() {
    injectLoginHeader();
    injectLoginButtons();
  }

  function observeLoginPage() {
    const observer = new MutationObserver(() => {
      runLoginEnhancements();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    if (!document.body) return;
    setBodyReadyFlag();
    runLoginEnhancements();
    observeLoginPage();
    log("custom.js loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();