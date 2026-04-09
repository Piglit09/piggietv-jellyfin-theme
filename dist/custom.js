/* AUTO-BUILT FILE - DO NOT EDIT */


/* ===== core\logger.js ===== */
window.PTV = window.PTV || {};

window.PTV.config = {
  LOG_PREFIX: "[PiggieTV]",
  LOGO_URL: "https://theme.piggietv.com/assets/logo/banner-light.png",
  DISCORD_URL: "https://discord.gg/FbtexGYau",
  SIGNUP_URL: "https://signup.piggietv.com/invite/ysBDoDSMpv5fFMz9GPMxUL"
};

window.PTV.log = function (...args) {
  console.log(window.PTV.config.LOG_PREFIX, ...args);
};

/* ===== core\helpers.js ===== */
window.PTV = window.PTV || {};

window.PTV.setBodyReadyFlag = function () {
  if (!document.body) return;
  document.body.classList.add("ptv-loaded");
};

window.PTV.getLoginForm = function () {
  return document.querySelector("#loginPage .manualLoginForm");
};

window.PTV.getSubmitButton = function () {
  const form = window.PTV.getLoginForm();
  if (!form) return null;

  return (
    form.querySelector('button[type="submit"]') ||
    form.querySelector(".button-submit") ||
    form.querySelector(".emby-button.submit") ||
    form.querySelector(".emby-button.button-submit")
  );
};

window.PTV.getUsernameInput = function () {
  const form = window.PTV.getLoginForm();
  if (!form) return null;

  return (
    form.querySelector('input[type="text"]') ||
    form.querySelector('input[name="username"]') ||
    form.querySelector(".emby-input")
  );
};

window.PTV._rafQueue = window.PTV._rafQueue || {};

window.PTV.schedule = function (key, fn) {
  if (window.PTV._rafQueue[key]) return;

  window.PTV._rafQueue[key] = true;

  requestAnimationFrame(() => {
    window.PTV._rafQueue[key] = false;
    fn();
  });
};

/* ===== branding\header-logo.js ===== */
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

/* ===== branding\sidebar-logo.js ===== */
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

/* ===== login\login-header.js ===== */
window.PTV = window.PTV || {};

window.PTV.injectLoginHeader = function () {
  const form = window.PTV.getLoginForm();
  if (!form || document.getElementById("ptv-login-header")) return;

  const header = document.createElement("div");
  header.id = "ptv-login-header";
  header.innerHTML = `
    <img src="${window.PTV.config.LOGO_URL}" class="ptv-login-logo" alt="PiggieTV">
    <div class="ptv-login-tagline">MOVIES • TV SHOWS • ANIME</div>
  `;

  form.prepend(header);
  window.PTV.log("login header injected");
};

/* ===== login\login-actions.js ===== */
window.PTV = window.PTV || {};

window.PTV.injectLoginButtons = function () {
  const form = window.PTV.getLoginForm();
  const submitBtn = window.PTV.getSubmitButton();

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
       href="${window.PTV.config.DISCORD_URL}"
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
      window.open(window.PTV.config.SIGNUP_URL, "_self");
      return;
    }

    if (action === "forgot") {
      if (forgotBtn) forgotBtn.click();
      return;
    }

    if (action === "quick") {
      if (quickBtn) quickBtn.click();
    }
  });

  window.PTV.log("login buttons injected");
};

/* ===== login\login-focus.js ===== */
window.PTV = window.PTV || {};

window.PTV.autofocusUsername = function () {
  const input = window.PTV.getUsernameInput();
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
};

/* ===== login\login-effects.js ===== */
window.PTV = window.PTV || {};

window.PTV.pulseSignIn = function () {
  const submitBtn = window.PTV.getSubmitButton();
  if (!submitBtn) return;

  submitBtn.classList.remove("ptv-enter-pulse");
  void submitBtn.offsetWidth;
  submitBtn.classList.add("ptv-enter-pulse");

  window.setTimeout(() => {
    submitBtn.classList.remove("ptv-enter-pulse");
  }, 700);
};

window.PTV.bindEnterPulse = function () {
  if (!document.body || document.body.dataset.ptvEnterBound === "1") return;
  document.body.dataset.ptvEnterBound = "1";

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    if (!document.querySelector("#loginPage")) return;

    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") {
      window.PTV.pulseSignIn();
    }
  });
};

window.PTV.runLoginEnhancements = function () {
  window.PTV.injectLoginHeader();
  window.PTV.injectLoginButtons();
  window.PTV.autofocusUsername();
};

/* ===== ui\background-glow.js ===== */
window.PTV = window.PTV || {};

window.PTV.ensureBackgroundGlowLayer = function () {
  const loginPage = document.querySelector("#loginPage");
  if (!loginPage) return null;

  let glow = document.getElementById("ptv-bg-glow");
  if (!glow) {
    glow = document.createElement("div");
    glow.id = "ptv-bg-glow";
    loginPage.appendChild(glow);
  }

  return glow;
};

window.PTV.bindBackgroundHover = function () {
  if (!document.body || document.body.dataset.ptvBgBound === "1") return;
  document.body.dataset.ptvBgBound = "1";

  const updateGlow = (event) => {
    const glow = window.PTV.ensureBackgroundGlowLayer();
    if (!glow) return;

    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;

    glow.style.setProperty("--ptv-x", `${x}%`);
    glow.style.setProperty("--ptv-y", `${y}%`);
  };

  window.addEventListener("mousemove", updateGlow, { passive: true });
};

/* ===== ui\home-backdrop.js ===== */
window.PTV = window.PTV || {};
window.PTV.runHomeBackdropEnhancement = function () {};

/* ===== core\observer.js ===== */
window.PTV = window.PTV || {};

window.PTV.runAll = function () {
  window.PTV.runGlobalBranding();
  window.PTV.runLoginEnhancements();
  window.PTV.runHomeBackdropEnhancement();
};

window.PTV.observeApp = function () {
  if (!document.body || document.body.dataset.ptvObserverBound === "1") return;
  document.body.dataset.ptvObserverBound = "1";

  const observer = new MutationObserver((mutations) => {
    let shouldRunBranding = false;
    let shouldRunLogin = false;

    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const nodes = [
          ...mutation.addedNodes,
          ...mutation.removedNodes
        ];

        for (const node of nodes) {
          if (!(node instanceof HTMLElement)) continue;

          if (
            node.matches?.(".skinHeader, .mainDrawer, .navMenu, .drawerContent") ||
            node.querySelector?.(".skinHeader, .mainDrawer, .navMenu, .drawerContent")
          ) {
            shouldRunBranding = true;
          }

          if (
            node.matches?.("#loginPage, .manualLoginForm") ||
            node.querySelector?.("#loginPage, .manualLoginForm")
          ) {
            shouldRunLogin = true;
          }
        }
      }

      if (mutation.type === "attributes") {
        const el = mutation.target;
        if (!(el instanceof HTMLElement)) continue;

        if (
          el.matches(".skinHeader, .mainDrawer, .navMenu, .drawerContent") ||
          el.closest(".skinHeader, .mainDrawer")
        ) {
          shouldRunBranding = true;
        }

        if (
          el.matches("#loginPage, .manualLoginForm") ||
          el.closest("#loginPage")
        ) {
          shouldRunLogin = true;
        }
      }
    }

    if (shouldRunBranding) {
      window.PTV.schedule("branding", () => {
        window.PTV.runGlobalBranding();
      });
    }

    if (shouldRunLogin) {
      window.PTV.schedule("login", () => {
        window.PTV.runLoginEnhancements();
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"]
  });

  window.PTV.schedule("branding", () => {
    window.PTV.runGlobalBranding();
  });

  window.PTV.schedule("login", () => {
    window.PTV.runLoginEnhancements();
  });
};

/* ===== core\init.js ===== */
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
