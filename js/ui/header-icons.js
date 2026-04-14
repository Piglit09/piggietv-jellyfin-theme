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