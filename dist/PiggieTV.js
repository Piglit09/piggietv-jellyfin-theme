/* AUTO-BUILT FILE - DO NOT EDIT */

/* ===== js\branding\header-logo.js ===== */
/* ===== PIGGIETV HEADER LOGO ===== */
(function () {
  const LOGO_URL = "https://theme.piggietv.com/assets/logo/banner-light.png";

  function getBrandTargets() {
    return Array.from(
      document.querySelectorAll(
        [
          ".skinHeader .headerLogo",
          ".skinHeader .headerBranding",
          ".skinHeader .pageTitleWithLogo",
          ".skinHeader .pageTitle",
          ".skinHeader .headerLeft .headerLogo",
          ".skinHeader .headerLeft .headerBranding"
        ].join(",")
      )
    );
  }

  function bindEffects(target, img) {
    if (!target || target.dataset.ptvFxBound === "true") return;
    target.dataset.ptvFxBound = "true";

    let glow = target.querySelector(".ptv-header-logo-glow");
    if (!glow) {
      glow = document.createElement("span");
      glow.className = "ptv-header-logo-glow";
      target.prepend(glow);
    }

    target.addEventListener("mousemove", (e) => {
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      target.style.setProperty("--ptv-glow-x", `${x}%`);
      target.style.setProperty("--ptv-glow-y", `${y}%`);

      const rotateY = ((x - 50) / 50) * 4;
      const rotateX = ((50 - y) / 50) * 3;

      img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });

    target.addEventListener("mouseleave", () => {
      img.style.transform = "";
      target.style.setProperty("--ptv-glow-x", "50%");
      target.style.setProperty("--ptv-glow-y", "50%");
    });
  }

  function applyToTarget(target) {
    if (!target) return false;

    target.classList.add("ptv-header-logo-wrap");
    target.classList.remove("pageTitleWithLogo", "pageTitleWithDefaultLogo");

    let img = target.querySelector("img.ptv-header-logo");
    if (!img) {
      target.textContent = "";
      target.innerHTML = "";

      img = document.createElement("img");
      img.src = LOGO_URL;
      img.alt = "PiggieTV";
      img.className = "ptv-header-logo";
      target.appendChild(img);
    } else if (img.src !== LOGO_URL) {
      img.src = LOGO_URL;
    }

    bindEffects(target, img);
    return true;
  }

  function applyLogo() {
    const targets = getBrandTargets();
    if (!targets.length) return false;

    let applied = false;
    targets.forEach((target) => {
      applied = applyToTarget(target) || applied;
    });

    return applied;
  }

  let scheduled = false;

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      applyLogo();
    });
  }

  function hookHistory() {
    if (window.__ptvHeaderLogoHooked) return;
    window.__ptvHeaderLogoHooked = true;

    const origPush = history.pushState;
    history.pushState = function () {
      const result = origPush.apply(this, arguments);
      setTimeout(scheduleApply, 0);
      setTimeout(scheduleApply, 150);
      setTimeout(scheduleApply, 500);
      return result;
    };

    const origReplace = history.replaceState;
    history.replaceState = function () {
      const result = origReplace.apply(this, arguments);
      setTimeout(scheduleApply, 0);
      setTimeout(scheduleApply, 150);
      setTimeout(scheduleApply, 500);
      return result;
    };
  }

  function init() {
    scheduleApply();
    hookHistory();

    const observer = new MutationObserver(() => {
      scheduleApply();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener("popstate", scheduleApply);
    window.addEventListener("hashchange", scheduleApply);

    setTimeout(scheduleApply, 100);
    setTimeout(scheduleApply, 400);
    setTimeout(scheduleApply, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ===== js\ui\header-icons.js ===== */
/* ===== PIGGIETV ICON INJECTOR ===== */
(function () {
  const BASE = "https://theme.piggietv.com/assets/icons";

  const ICONS = {
    home: `${BASE}/home.svg`,
    favorites: `${BASE}/favorites.svg`,
    request: `${BASE}/request.svg`,
    anime: `${BASE}/anime.svg`,
    animemovies: `${BASE}/animovie.svg`,
    cartoons: `${BASE}/cartoons.svg`,
    movies: `${BASE}/movies.svg`,
    shows: `${BASE}/tv.svg`,
    music: `${BASE}/music.svg`,
    collections: `${BASE}/collections.svg`,
    livetv: `${BASE}/live-tv.svg`,
    guide: `${BASE}/live-tv.svg`,
    playlists: `${BASE}/playlists.svg`,
    dashboard: `${BASE}/dashboard.svg`,
    metadata: `${BASE}/metadata-manager.svg`,
    settings: `${BASE}/settings.svg`,
    signout: `${BASE}/signout.svg`,
    quickconnect: `${BASE}/devices.svg`,
    display: `${BASE}/display.svg`,
    subtitles: `${BASE}/subtitles.svg`,
    controls: `${BASE}/devices.svg`,
    playback: `${BASE}/play.svg`,
    profile: `${BASE}/user.svg`,
    users: `${BASE}/user.svg`,
    menu: `${BASE}/menu.svg`,
    cast: `${BASE}/cast.svg`,
    search: `${BASE}/search.svg`,
    syncplay: `${BASE}/sync.svg`,
    back: `${BASE}/back.svg`,
    left: `${BASE}/left.svg`,
    right: `${BASE}/right.svg`,
    detailplay: `${BASE}/play.svg`,
    detailmedia: `${BASE}/movies.svg`,
    detailshuffle: `${BASE}/shuffle.svg`,
    detailplayed: `${BASE}/check.svg`,
    detailfavorite: `${BASE}/favorites.svg`,
    detailmore: `${BASE}/menu.svg`,
  };

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function makeIcon(key, className) {
    const img = document.createElement("img");
    img.src = ICONS[key];
    img.alt = key;
    img.className = className;
    img.setAttribute("data-ptv-key", key);
    return img;
  }

  function isExcludedArea(el) {
    return !!el.closest(
      ".cardBox, .cardScalable, .itemCard, .folderCard, .visualCard, .emby-tabs-slider"
    );
  }
function replaceSlotIcon(slot, key, cls) {
  if (!slot || !ICONS[key]) return;

  // prevent duplicates
  if (slot.querySelector(`img.${cls}`)) return;

  // DO NOT wipe the slot anymore ❌
  // slot.textContent = "";
  // slot.innerHTML = "";

  // remove only text nodes (keeps layout structure intact)
  Array.from(slot.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.remove();
    }
  });

  // remove existing icon fonts only
  slot.classList.add("ptv-icon-replaced");

  const img = document.createElement("img");
  img.src = ICONS[key];
  img.className = cls;
  img.setAttribute("draggable", "false");

  // clear only icon font rendering (not layout)
  const existingIcon = slot.querySelector(
    ".material-icons, .md-icon, .button-icon"
  );
  if (existingIcon) existingIcon.remove();

  slot.appendChild(img);
}

  function ensureSlot(row, slotClass, beforeSelectorList) {
    let slot = row.querySelector(`.${slotClass}`);
    if (slot) return slot;

    slot = document.createElement("span");
    slot.className = slotClass;

    let anchor = null;
    for (const selector of beforeSelectorList) {
      anchor = row.querySelector(selector);
      if (anchor) break;
    }

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(slot, anchor);
    } else {
      row.prepend(slot);
    }

    return slot;
  }

  function mapSidebarKey(text) {
    if (text === "home") return "home";
    if (text === "favorites") return "favorites";
    if (text === "request") return "request";
    if (text === "anime") return "anime";
    if (text === "anime movies") return "animemovies";
    if (text === "cartoons") return "cartoons";
    if (text === "movies") return "movies";
    if (text === "shows") return "shows";
    if (text === "music") return "music";
    if (text.startsWith("collection")) return "collections";
    if (text === "live tv") return "livetv";
    if (text === "guide") return "guide";
    if (text === "playlists") return "playlists";
    if (text === "dashboard") return "dashboard";
    if (text.includes("metadata manager")) return "metadata";
    if (text === "settings") return "settings";
    if (text.includes("sign out")) return "signout";
    return null;
  }

  function mapHeaderKey(title, className) {
  if (title === "menu" || className.includes("headermenubutton")) return "menu";
  if (title === "back" || className.includes("headerbackbutton")) return "back";
  if (title === "home" || className.includes("headerhomebutton")) return "home";
  if (title === "syncplay" || className.includes("syncbutton")) return "syncplay";
  if (title === "cast to device" || className.includes("castbutton")) return "cast";
  if (title === "search" || className.includes("headersearchbutton")) return "search";
  if (title === "player" || className.includes("audioplayerbutton") || className.includes("headeraudioplayerbutton")) return "music";
  if (title === "piggie" || className.includes("headeruserbutton")) return "users";
  return null;
}

function mapDetailButtonKey(button) {
  const title = normalize(button.getAttribute("title"));
  const aria = normalize(button.getAttribute("aria-label"));
  const className = normalize(button.className);
  const text = normalize(button.textContent);
  const all = `${title} ${aria} ${className} ${text}`;

  if (all.includes("trailer")) return "detailmedia";
  if (all.includes("mark played") || all.includes("played") || all.includes("watched") || all.includes("playstate")) return "detailplayed";
  if (all.includes("shuffle")) return "detailshuffle";
  if (all.includes("favorite") || all.includes("unfavorite")) return "detailfavorite";
  if (all.includes("more")) return "detailmore";
  if (all.includes("play")) return "detailplay";

  return null;
}

  function mapSettingsKey(text) {
    if (text.includes("profile")) return "profile";
    if (text.includes("quick connect")) return "quickconnect";
    if (text === "display") return "display";
    if (text === "home") return "home";
    if (text === "playback") return "playback";
    if (text === "subtitles") return "subtitles";
    if (text === "controls") return "controls";
    if (text === "dashboard") return "dashboard";
    if (text.includes("metadata manager")) return "metadata";
    if (text === "settings") return "settings";
    if (text.includes("sign out")) return "signout";
    return null;
  }

  function mapHeaderKey(title, className) {
    if (title === "menu" || className.includes("headermenubutton")) return "menu";
    if (title === "back" || className.includes("headerbackbutton")) return "back";
    if (title === "home" || className.includes("headerhomebutton")) return "home";
    if (title === "syncplay" || className.includes("syncbutton")) return "syncplay";
    if (title === "cast to device" || className.includes("castbutton")) return "cast";
    if (title === "search" || className.includes("headersearchbutton")) return "search";
    if (title === "piggie" || className.includes("headeruserbutton")) return "users";
    return null;
  }

  function scanSidebar() {
    document.querySelectorAll(".navMenuOption").forEach((row) => {
      if (isExcludedArea(row)) return;

      const text = normalize(row.textContent);
      const key = mapSidebarKey(text);
      if (!key) return;

      const slot = ensureSlot(row, "navMenuOptionIcon", [
        ".navMenuOptionText",
        ".buttonText",
        "span",
        "div"
      ]);

      replaceSlotIcon(slot, key, "ptv-icon-sidebar");
    });
  }

  function scanSettings() {
    document.querySelectorAll(".listItem, a.listItem, button.listItem").forEach((row) => {
      if (isExcludedArea(row)) return;

      const text = normalize(row.textContent);
      const key = mapSettingsKey(text);
      if (!key) return;

      const slot = ensureSlot(row, "listItemIcon", [
        ".listItemBodyText",
        ".buttonText",
        "span",
        "div"
      ]);

      replaceSlotIcon(slot, key, "ptv-icon-settings");
    });
  }

  function scanHeader() {
    document
      .querySelectorAll(".skinHeader .headerButton, .skinHeader .paper-icon-button-light")
      .forEach((button) => {
        if (button.closest(".emby-tabs-slider")) return;

        const title = normalize(button.getAttribute("title"));
        const className = normalize(button.className);
        const key = mapHeaderKey(title, className);
        if (!key) return;

        const slot =
          button.querySelector(".headerButtonIcon") ||
          button.querySelector(".button-icon") ||
          button.querySelector(".md-icon") ||
          button.querySelector(".material-icons");

        replaceSlotIcon(slot, key, "ptv-icon-header");
      });
  }

  function scanScrollerButtons() {
    document.querySelectorAll(".emby-scrollbuttons-button").forEach((button) => {
      const dir = normalize(button.getAttribute("data-direction"));
      const title = normalize(button.getAttribute("title"));

      const slot =
        button.querySelector(".material-icons") ||
        button.querySelector(".md-icon") ||
        button.querySelector(".button-icon");

      if (!slot) return;

      if (dir === "left" || title === "previous") {
        replaceSlotIcon(slot, "left", "ptv-icon-header");
      } else if (dir === "right" || title === "next") {
        replaceSlotIcon(slot, "right", "ptv-icon-header");
      }
    });
  }

function mapDetailButtonKey(button) {
  const title = normalize(button.getAttribute("title"));
  const aria = normalize(button.getAttribute("aria-label"));
  const className = normalize(button.className);
  const text = normalize(button.textContent);
  const all = `${title} ${aria} ${className} ${text}`;

  // most specific first
  if (all.includes("trailer")) return "detailmedia";
  if (all.includes("mark played") || all.includes("played") || all.includes("watched") || all.includes("playstate")) return "detailplayed";
  if (all.includes("shuffle")) return "detailshuffle";
  if (all.includes("favorite") || all.includes("unfavorite")) return "detailfavorite";
  if (all.includes("more")) return "detailmore";
  if (all.includes("play")) return "detailplay";

  return null;
}

function scanDetailButtons() {
  document.querySelectorAll(
    "#itemDetailPage .mainDetailButtons button, #itemDetailPage .mainDetailButtons a"
  ).forEach((button) => {

    // ❌ SKIP hidden buttons (THIS FIXES YOUR EMPTY ICONS)
    if (
      button.classList.contains("hide") ||
      button.offsetParent === null ||
      getComputedStyle(button).display === "none"
    ) {
      return;
    }

    const key = mapDetailButtonKey(button);
    if (!key || !ICONS[key]) return;

    const slot =
      button.querySelector(".detailButton-icon") ||
      button.querySelector(".material-icons") ||
      button.querySelector(".md-icon") ||
      button.querySelector(".button-icon") ||
      button.querySelector("span");

    if (!slot) return;

    replaceSlotIcon(slot, key, "ptv-icon-detail-action");
  });
}

  function run() {
    scanSidebar();
    scanSettings();
    scanHeader();
    scanScrollerButtons();
    scanDetailButtons();
  }

  let scheduled = false;

  function scheduleRun() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      run();
    });
  }

  function hookHistory() {
    if (window.__ptvHeaderIconsHistoryHooked) return;
    window.__ptvHeaderIconsHistoryHooked = true;

    const originalPushState = history.pushState;
    history.pushState = function () {
      const result = originalPushState.apply(this, arguments);
      scheduleRun();
      return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
      const result = originalReplaceState.apply(this, arguments);
      scheduleRun();
      return result;
    };
  }

  function init() {
    run();
    hookHistory();

    const observer = new MutationObserver(() => {
      scheduleRun();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    let pollCount = 0;
    const poll = setInterval(() => {
      scheduleRun();
      pollCount += 1;
      if (pollCount > 20) clearInterval(poll);
    }, 250);

    window.addEventListener("popstate", scheduleRun);
    window.addEventListener("hashchange", scheduleRun);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ===== js\ui\playback-icons.js ===== */
/* ===== PIGGIETV PLAYBACK ICONS ===== */
(function () {
  window.__ptvPlaybackIconsLoaded = true;
  console.log("[PTV] playback-icons loaded");

  const BASE = "https://theme.piggietv.com/assets/icons/playback";

  const ICON_MAP = [
    { button: ".btnPreviousTrack", file: "skip-previous.svg" },
    { button: ".btnPreviousChapter", file: "previous-chapter.svg" },
    { button: ".btnRewind", file: "rewind.svg" },
    { button: ".btnPause", file: "play.svg" },
    { button: ".btnPlay", file: "play.svg" },
    { button: ".btnFastForward", file: "fast-forward.svg" },
    { button: ".btnNextChapter", file: "next-chapter.svg" },
    { button: ".btnNextTrack", file: "skip-next.svg" },
    { button: ".btnUserRating", file: "favorite.svg" },
    { button: ".btnSubtitles", file: "subtitles.svg" },
    { button: ".btnAudio", file: "audio.svg" },
    { button: ".btnMute", file: "volume.svg" },
    { button: ".btnVideoOsdSettings", file: "settings.svg" },
    { button: ".btnPip", file: "pip.svg" },
    { button: ".btnFullscreen", file: "fullscreen.svg" }
  ];

  function isPlaybackPage() {
    return (
      location.hash.startsWith("#/video") ||
      location.pathname.includes("/video") ||
      document.querySelector(".videoPlayerContainer") ||
      document.querySelector("#videoOsdPage")
    );
  }

  function replaceButtonIcon(button, file) {
    if (!button || button.dataset.ptvPlaybackBound === "1") return;

    const iconHost =
      button.querySelector(".xlargePaperIconButton") ||
      button.querySelector(".material-icons") ||
      button.querySelector("span");

    if (!iconHost) return;

    button.dataset.ptvPlaybackBound = "1";

    iconHost.textContent = "";
    iconHost.classList.add("ptv-playback-icon-replaced");

    const img = document.createElement("img");
    img.src = `${BASE}/${file}`;
    img.alt = "";
    img.className = "ptv-icon ptv-playback-icon";
    img.draggable = false;

    iconHost.appendChild(img);
  }

  function applyPlaybackIcons() {
    if (!isPlaybackPage()) return;

    ICON_MAP.forEach(({ button: selector, file }) => {
      document.querySelectorAll(selector).forEach((btn) => {
        replaceButtonIcon(btn, file);
      });
    });
  }

  let scheduled = false;
  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      applyPlaybackIcons();
    });
  }

  function hookHistory() {
    if (window.__ptvPlaybackIconsHistoryHooked) return;
    window.__ptvPlaybackIconsHistoryHooked = true;

    const originalPushState = history.pushState;
    history.pushState = function () {
      const result = originalPushState.apply(this, arguments);
      setTimeout(scheduleApply, 0);
      setTimeout(scheduleApply, 250);
      setTimeout(scheduleApply, 800);
      setTimeout(scheduleApply, 1500);
      return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
      const result = originalReplaceState.apply(this, arguments);
      setTimeout(scheduleApply, 0);
      setTimeout(scheduleApply, 250);
      setTimeout(scheduleApply, 800);
      setTimeout(scheduleApply, 1500);
      return result;
    };
  }

  function init() {
    hookHistory();
    scheduleApply();

    const observer = new MutationObserver(() => {
      scheduleApply();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener("hashchange", scheduleApply);
    window.addEventListener("popstate", scheduleApply);

    setTimeout(scheduleApply, 300);
    setTimeout(scheduleApply, 900);
    setTimeout(scheduleApply, 1800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ===== js\login\login-actions.js ===== */
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

/* ===== js\login\login-effects.js ===== */
/* ===== PIGGIETV LOGIN EFFECTS ===== */
(function () {
  function isLoginPage() {
    return !!document.querySelector("#loginPage");
  }

  function getLoginCard() {
    return (
      document.querySelector("#loginPage .manualLoginForm") ||
      document.querySelector("#loginPage form")
    );
  }

  function initGlow() {
    const card = getLoginCard();
    if (!card || card.dataset.ptvGlow === "true") return;

    card.dataset.ptvGlow = "true";

    const glow = document.createElement("div");
    glow.className = "ptv-mouse-glow";
    card.appendChild(glow);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.setProperty("--x", `${x}px`);
      glow.style.setProperty("--y", `${y}px`);
    });
  }

  function apply() {
    if (!isLoginPage()) return;
    initGlow();
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

/* ===== js\ui\sidebar-links.js ===== */
/* ===== PIGGIETV SIDEBAR CUSTOM LINKS ===== */
(function () {
  const LINKS = [
    { label: "Request", icon: "request", url: "https://request.piggietv.com" },
    { label: "Games", icon: "games", url: "https://emu.piggietv.com" },
    { label: "Library", icon: "library", url: "https://books.piggietv.com" },
    { label: "Discord", icon: "discord", url: "https://discord.gg/FbtexGYau" }
  ];

  const BASE = "https://theme.piggietv.com/assets/icons";

  function getSidebarContainer() {
    return (
      document.querySelector(".mainDrawer-scrollContainer") ||
      document.querySelector(".mainDrawer-content") ||
      document.querySelector(".mainDrawer")
    );
  }

  function injectTopBranding(container) {
    if (!container || container.querySelector(".ptv-sidebar-top")) return;

    const wrap = document.createElement("div");
    wrap.className = "ptv-sidebar-top";
    wrap.innerHTML = `
      <div class="ptv-sidebar-brand">
        <img
          src="https://theme.piggietv.com/assets/logo/banner-light.png"
          class="ptv-sidebar-logo"
          alt="PiggieTV"
        />
      </div>
    `;

    container.insertBefore(wrap, container.firstChild);
  }

  function createSection() {
    const frag = document.createDocumentFragment();

    const dividerTop = document.createElement("div");
    dividerTop.className = "ptv-custom-divider";

    const title = document.createElement("h3");
    title.className = "sidebarHeader ptv-custom-section-title";
    title.innerHTML = `
      <span class="ptv-custom-section-icon">
        <img src="${BASE}/piggie-hub.svg" class="ptv-custom-section-icon-img" alt="Piggie Hub">
      </span>
      <span class="ptv-custom-section-label">Piggie Hub</span>
    `;

    frag.appendChild(dividerTop);
    frag.appendChild(title);

    LINKS.forEach((link) => {
      const a = document.createElement("a");
      a.className = "emby-linkbutton navMenuOption lnkMediaFolder ptv-custom-link";
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("data-ptv-url", link.url);

      a.innerHTML = `
        <span class="navMenuOptionIcon" aria-hidden="true">
          <img src="${BASE}/${link.icon}.svg" class="ptv-icon-sidebar" alt="${link.label}">
        </span>
        <span class="navMenuOptionText">${link.label}</span>
      `;

      a.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(link.url, "_blank", "noopener,noreferrer");
      });

      frag.appendChild(a);
    });

    const dividerBottom = document.createElement("div");
    dividerBottom.className = "ptv-custom-divider";
    frag.appendChild(dividerBottom);

    return frag;
  }

  function bindSectionGlow(container) {
    const section = container.querySelector(".ptv-custom-section-title");
    if (!section || section.dataset.ptvBound === "true") return;
    section.dataset.ptvBound = "true";

    container.querySelectorAll(".ptv-custom-link").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        section.classList.add("ptv-section-hover");
      });

      link.addEventListener("mouseleave", () => {
        section.classList.remove("ptv-section-hover");
      });
    });
  }

  function ensureSpotlight(container) {
    let spot = container.querySelector(".ptv-sidebar-spotlight");
    if (!spot) {
      spot = document.createElement("div");
      spot.className = "ptv-sidebar-spotlight";
      container.prepend(spot);
    }
    return spot;
  }

  function bindSpotlight(container) {
    const spot = ensureSpotlight(container);

    const items = Array.from(
      container.querySelectorAll(".navMenuOption, .ptv-custom-link")
    ).filter((el) => el.offsetParent !== null);

    items.forEach((item) => {
      if (item.dataset.ptvSpotlightBound === "1") return;
      item.dataset.ptvSpotlightBound = "1";

      const move = () => {
        const rect = item.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();
        const top = rect.top - parentRect.top + container.scrollTop;

        spot.style.height = `${rect.height}px`;
        spot.style.transform = `translateY(${top}px)`;
        spot.style.opacity = "1";
      };

      item.addEventListener("mouseenter", move);
      item.addEventListener("mousemove", move);
      item.addEventListener("focusin", move);
      item.addEventListener("mouseleave", () => {
        spot.style.opacity = "0";
      });
    });

    container.addEventListener("mouseleave", () => {
      spot.style.opacity = "0";
    });
  }

  function inject() {
    const container = getSidebarContainer();
    if (!container) return;

    injectTopBranding(container);

    const userSection = container.querySelector(".userMenuOptions");
    if (!userSection) return;

    if (!container.querySelector(".ptv-custom-section-title")) {
      container.insertBefore(createSection(), userSection);
    }

    bindSectionGlow(container);
    bindSpotlight(container);
  }

  let scheduled = false;
  function scheduleInject() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      inject();
    });
  }

  function hookHistory() {
    if (window.__ptvSidebarLinksHooked) return;
    window.__ptvSidebarLinksHooked = true;

    const originalPushState = history.pushState;
    history.pushState = function () {
      const result = originalPushState.apply(this, arguments);
      setTimeout(scheduleInject, 0);
      setTimeout(scheduleInject, 150);
      setTimeout(scheduleInject, 500);
      return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
      const result = originalReplaceState.apply(this, arguments);
      setTimeout(scheduleInject, 0);
      setTimeout(scheduleInject, 150);
      setTimeout(scheduleInject, 500);
      return result;
    };
  }

  function init() {
    scheduleInject();
    hookHistory();

    const observer = new MutationObserver(() => {
      scheduleInject();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener("popstate", scheduleInject);
    window.addEventListener("hashchange", scheduleInject);

    setTimeout(scheduleInject, 100);
    setTimeout(scheduleInject, 400);
    setTimeout(scheduleInject, 900);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ===== js\ui\home-backdrop.js ===== */
/* ===== PIGGIETV DYNAMIC HOME BACKDROP ===== */
(function () {
  const BACKDROP_ID = "ptv-dynamic-backdrop";

  function isPlaybackPage() {
    return (
      location.hash.startsWith("#/video") ||
      document.querySelector(".videoPlayerContainer") ||
      document.querySelector("#videoOsdPage") ||
      document.querySelector("#itemVideoPlayer")
    );
  }

  function getPage() {
    return document.querySelector(".homePage, .libraryPage, .indexPage");
  }

  function getBackgroundHost() {
    return document.querySelector(".backgroundContainer") || document.body;
  }

  function getExistingBackdrop() {
    return document.getElementById(BACKDROP_ID);
  }

  function removeBackdrop() {
    const el = getExistingBackdrop();
    if (el) el.remove();
  }

  function ensureBackdrop() {
    if (isPlaybackPage()) {
      removeBackdrop();
      return null;
    }

    let el = getExistingBackdrop();
    const host = getBackgroundHost();

    if (!el) {
      el = document.createElement("div");
      el.id = BACKDROP_ID;
      el.className = "ptv-dynamic-backdrop";
      host.appendChild(el);
    } else if (el.parentNode !== host) {
      host.appendChild(el);
    }

    return el;
  }

  function getCardImage(card) {
    if (!card) return null;

    const imgSelectors = [
      ".cardImageContainer img",
      ".cardImage img",
      ".cardPadder img",
      ".cardContent img"
    ];

    for (const selector of imgSelectors) {
      const img = card.querySelector(selector);
      if (img && img.src) return img.src;
    }

    const bgCandidates = [
      ".cardImageContainer",
      ".cardImage",
      ".cardPadder",
      ".cardContent"
    ];

    for (const selector of bgCandidates) {
      const el = card.querySelector(selector);
      if (!el) continue;

      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== "none") {
        const match = bg.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) return match[1];
      }
    }

    return null;
  }

  function getBestCard() {
    const hovered = document.querySelector(".card:hover");
    if (hovered) return hovered;

    const focused =
      document.querySelector(".card:focus-within") ||
      document.querySelector(".card.scaledCard") ||
      document.querySelector(".card.focused");

    if (focused) return focused;

    const visibleCards = Array.from(document.querySelectorAll(".card")).filter((card) => {
      const rect = card.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight
      );
    });

    return visibleCards[0] || null;
  }

  function setBackdrop(src) {
    const backdrop = ensureBackdrop();
    if (!backdrop) return;

    if (!src) {
      backdrop.classList.remove("is-visible");
      backdrop.style.removeProperty("--ptv-backdrop-image");
      backdrop.dataset.src = "";
      return;
    }

    if (backdrop.dataset.src === src) return;

    backdrop.dataset.src = src;
    backdrop.style.setProperty("--ptv-backdrop-image", `url("${src}")`);
    backdrop.classList.add("is-visible");
  }

  function updateBackdrop() {
    if (isPlaybackPage()) {
      removeBackdrop();
      return;
    }

    const page = getPage();
    const backdrop = ensureBackdrop();
    if (!backdrop) return;

    if (!page) {
      backdrop.classList.remove("is-visible");
      backdrop.style.removeProperty("--ptv-backdrop-image");
      backdrop.dataset.src = "";
      return;
    }

    const card = getBestCard();
    const src = getCardImage(card);
    setBackdrop(src);
  }

  let scheduled = false;

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      updateBackdrop();
    });
  }

  function bindCardEvents() {
    document.querySelectorAll(".card").forEach((card) => {
      if (card.dataset.ptvBackdropBound === "true") return;
      card.dataset.ptvBackdropBound = "true";

      card.addEventListener("mouseenter", scheduleUpdate);
      card.addEventListener("focusin", scheduleUpdate);
      card.addEventListener("click", scheduleUpdate);
    });
  }

  function hookHistory() {
    if (window.__ptvBackdropHistoryHooked) return;
    window.__ptvBackdropHistoryHooked = true;

    const originalPushState = history.pushState;
    history.pushState = function () {
      const result = originalPushState.apply(this, arguments);
      setTimeout(scheduleUpdate, 0);
      setTimeout(scheduleUpdate, 250);
      setTimeout(scheduleUpdate, 700);
      return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
      const result = originalReplaceState.apply(this, arguments);
      setTimeout(scheduleUpdate, 0);
      setTimeout(scheduleUpdate, 250);
      setTimeout(scheduleUpdate, 700);
      return result;
    };
  }

  function init() {
    hookHistory();
    bindCardEvents();
    scheduleUpdate();

    const observer = new MutationObserver(() => {
      bindCardEvents();
      scheduleUpdate();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("popstate", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    setTimeout(scheduleUpdate, 400);
    setTimeout(scheduleUpdate, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

