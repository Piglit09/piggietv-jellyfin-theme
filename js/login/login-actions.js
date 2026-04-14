/* ===== PIGGIETV LOGIN ACTIONS ===== */
(function () {
  const DISCORD_URL = "https://discord.gg/FbtexGYau";
  const SIGNUP_URL = "https://signup.piggietv.com/invite/ysBDoDSMpv5fFMz9GPMxUL";
  const FORGOT_PASSWORD_URL = "https://signup.piggietv.com/my/account";
  const LOGO_URL = "https://theme.piggietv.com/assets/logo/banner-light.png";

  function isLoginPage() {
    return !!document.querySelector("#loginPage");
  }

  function getLoginForm() {
    return (
      document.querySelector("#loginPage .manualLoginForm") ||
      document.querySelector("#loginPage form")
    );
  }

  function createBrandBlock() {
    const wrap = document.createElement("div");
    wrap.className = "ptv-login-brand";
    wrap.innerHTML = `
      <img class="ptv-login-logo" src="${LOGO_URL}" alt="PiggieTV">
      <div class="ptv-login-tagline">Movies • TV Shows • Anime</div>
    `;
    return wrap;
  }

  function createExtras() {
    const wrap = document.createElement("div");
    wrap.className = "ptv-extra-actions";
    wrap.innerHTML = `
      <a class="ptv-extra-btn" href="${SIGNUP_URL}" target="_blank" rel="noopener noreferrer">Sign Up</a>
      <a class="ptv-extra-btn" href="${FORGOT_PASSWORD_URL}" target="_blank" rel="noopener noreferrer">Forgot Password</a>
      <a class="ptv-extra-btn discord" href="${DISCORD_URL}" target="_blank" rel="noopener noreferrer">
        <img src="https://theme.piggietv.com/assets/icons/discord.svg" class="ptv-btn-icon" alt="">
        Discord
      </a>
      <a class="ptv-extra-btn" href="#" id="ptv-quick-connect">Use Quick Connect</a>
    `;
    return wrap;
  }

  function bindQuickConnect() {
    const quickBtn = document.getElementById("ptv-quick-connect");
    if (!quickBtn || quickBtn.dataset.ptvBound === "true") return;

    quickBtn.dataset.ptvBound = "true";
    quickBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const realQuickConnect = Array.from(
        document.querySelectorAll("#loginPage button, #loginPage .emby-button, #loginPage a")
      ).find((el) =>
        (el.textContent || "").trim().toLowerCase().includes("quick connect")
      );

      if (realQuickConnect) realQuickConnect.click();
    });
  }

  function relabelStockButtons(form) {
    form.querySelectorAll("button, .emby-button, a").forEach((el) => {
      const text = (el.textContent || "").trim().toLowerCase();

      if (
        (text === "forgot password" || text === "forgot password?") &&
        el.tagName.toLowerCase() === "a"
      ) {
        el.setAttribute("href", FORGOT_PASSWORD_URL);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  function hideStockLoginActions() {
    if (!isLoginPage()) return;

    const extraActions = document.querySelector(".ptv-extra-actions");

    document.querySelectorAll("#loginPage button, #loginPage a, #loginPage .emby-button").forEach((el) => {
      if (extraActions && extraActions.contains(el)) return;

      const text = (el.textContent || "").trim().toLowerCase();

      if (
        text === "use quick connect" ||
        text === "quick connect" ||
        text === "forgot password" ||
        text === "forgot password?"
      ) {
        el.style.setProperty("display", "none", "important");

        const parent = el.parentElement;
        if (parent && !parent.querySelector(":scope > .ptv-extra-actions")) {
          const parentText = (parent.textContent || "").trim().toLowerCase();
          if (
            parentText === "use quick connect" ||
            parentText === "quick connect" ||
            parentText === "forgot password" ||
            parentText === "forgot password?"
          ) {
            parent.style.setProperty("display", "none", "important");
          }
        }
      }
    });
  }

  function apply() {
    if (!isLoginPage()) return;

    const form = getLoginForm();
    if (!form) return;

    if (!form.querySelector(".ptv-login-brand")) {
      form.prepend(createBrandBlock());
    }

    if (!form.querySelector(".ptv-extra-actions")) {
      form.appendChild(createExtras());
    }

    bindQuickConnect();
    relabelStockButtons(form);
    hideStockLoginActions();
  }

  function init() {
    apply();

    const observer = new MutationObserver(() => {
      apply();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();