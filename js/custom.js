(function () {
  "use strict";

  const LOG_PREFIX = "[PiggieTV]";
  const LOGO_URL = "https://theme.piggietv.com/assets/logo/banner-light.png";
  const DISCORD_URL = "https://discord.gg/FbtexGYau";
  const SIGNUP_URL = "https://signup.piggietv.com/invite/ysBDoDSMpv5fFMz9GPMxUL";

  function log(...args) {
    console.log(LOG_PREFIX, ...args);
  }

  function setBodyReadyFlag() {
    document.body.classList.add("ptv-loaded");
  }

  function getLoginForm() {
    return document.querySelector("#loginPage .manualLoginForm");
  }

  function getSubmitButton() {
    const form = getLoginForm();
    if (!form) return null;

    return (
      form.querySelector('button[type="submit"]') ||
      form.querySelector(".button-submit") ||
      form.querySelector(".emby-button.submit") ||
      form.querySelector(".emby-button.button-submit")
    );
  }

  function getUsernameInput() {
    const form = getLoginForm();
    if (!form) return null;

    return (
      form.querySelector('input[type="text"]') ||
      form.querySelector('input[name="username"]') ||
      form.querySelector(".emby-input")
    );
  }

  function injectLoginHeader() {
    const form = getLoginForm();
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
    const form = getLoginForm();
    const submitBtn = getSubmitButton();

    if (!form || !submitBtn || document.getElementById("ptv-login-actions")) return;

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
        window.open(SIGNUP_URL, "_self");
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

  function autofocusUsername() {
    const input = getUsernameInput();
    if (!input) return;

    const alreadyFocused =
      document.activeElement === input ||
      document.activeElement?.tagName === "INPUT" ||
      document.activeElement?.tagName === "TEXTAREA";

    if (alreadyFocused) return;

    requestAnimationFrame(() => {
      try {
        input.focus({ preventScroll: true });
      } catch {
        input.focus();
      }
    });
  }

  function pulseSignIn() {
    const submitBtn = getSubmitButton();
    if (!submitBtn) return;

    submitBtn.classList.remove("ptv-enter-pulse");
    void submitBtn.offsetWidth;
    submitBtn.classList.add("ptv-enter-pulse");

    window.setTimeout(() => {
      submitBtn.classList.remove("ptv-enter-pulse");
    }, 700);
  }

  function bindEnterPulse() {
    if (document.body.dataset.ptvEnterBound === "1") return;
    document.body.dataset.ptvEnterBound = "1";

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      if (!document.querySelector("#loginPage")) return;

      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") {
        pulseSignIn();
      }
    });
  }

  function ensureBackgroundGlowLayer() {
    const loginPage = document.querySelector("#loginPage");
    if (!loginPage) return null;

    let glow = document.getElementById("ptv-bg-glow");
    if (!glow) {
      glow = document.createElement("div");
      glow.id = "ptv-bg-glow";
      loginPage.appendChild(glow);
    }
    return glow;
  }

  function bindBackgroundHover() {
    if (document.body.dataset.ptvBgBound === "1") return;
    document.body.dataset.ptvBgBound = "1";

    const updateGlow = (event) => {
      const glow = ensureBackgroundGlowLayer();
      if (!glow) return;

      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;

      glow.style.setProperty("--ptv-x", `${x}%`);
      glow.style.setProperty("--ptv-y", `${y}%`);
    };

    window.addEventListener("mousemove", updateGlow, { passive: true });
  }

  function replaceTopLeftLogo() {
    const header = document.querySelector(".skinHeader");
    if (!header) return false;

    const container =
      header.querySelector(".headerBranding") ||
      header.querySelector(".headerLogo") ||
      header.querySelector(".pageTitleWithLogo");

    if (!container) return false;
    if (container.dataset.ptvLogoApplied === "1") return true;

       container.dataset.ptvLogoApplied = "1";
       container.classList.add("ptv-brand-replaced");

    /* wipe built-in content */
       container.textContent = "";
       container.innerHTML = "";

     /* inject only PiggieTV logo */
    const img = document.createElement("img");
       img.src = LOGO_URL;
       img.className = "ptv-header-logo";
       img.alt = "PiggieTV";

container.appendChild(img);}

function waitForHeaderLogo() {
  let tries = 0;

  const interval = window.setInterval(() => {
    replaceTopLeftLogo();
    injectSidebarLogo();

    if (tries > 30) {
      window.clearInterval(interval);
    }
    tries += 1;
  }, 300);
}

function injectSidebarLogo() {
  const sidebarTargets = [
    ".mainDrawer .navMenu",
    ".mainDrawer .drawerContent",
    ".mainDrawer .itemsContainer",
    ".mainDrawer-scrollContainer"
  ];

  let container = null;
  for (const selector of sidebarTargets) {
    container = document.querySelector(selector);
    if (container) break;
  }

  if (!container) return false;

  const existing = document.getElementById("ptv-sidebar-logo");
  if (existing && existing.parentElement === container) return true;
  if (existing) existing.remove();

  const wrap = document.createElement("div");
  wrap.id = "ptv-sidebar-logo";

  const img = document.createElement("img");
  img.src = LOGO_URL;
  img.className = "ptv-sidebar-logo-img";
  img.alt = "PiggieTV";

  wrap.appendChild(img);
  container.prepend(wrap);
  return true;
}

function observeApp() {
  const observer = new MutationObserver(() => {
    runGlobalBranding();
    runLoginEnhancements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"]
  });

  /* extra retry passes for Jellyfin async UI rebuilds */
  let tries = 0;
  const interval = window.setInterval(() => {
    runGlobalBranding();
    runLoginEnhancements();
    tries += 1;
    if (tries > 20) window.clearInterval(interval);
  }, 500);
}

  function init() {
    if (!document.body) return;

    setBodyReadyFlag();
    waitForHeaderLogo();
    runGlobalBranding();
    runLoginEnhancements();
    bindEnterPulse();
    bindBackgroundHover();
    observeApp();

    log("custom.js loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();