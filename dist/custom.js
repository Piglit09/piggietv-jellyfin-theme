(function () {
  "use strict";

  const LOGO_URL = "https://theme.piggietv.com/assets/logo/banner-light.png";
  const DISCORD_URL = "https://discord.gg/FbtexGYau";
  const SIGNUP_URL = "https://signup.piggietv.com/invite/ysBDoDSMpv5fFMz9GPMxUL";
  const FORGOT_URL = "https://signup.piggietv.com/my/account";
  const DEFAULT_BACKDROP_URL = "https://theme.piggietv.com/assets/backgrounds/PiggieTVBG.png";

  const DISCORD_ICON_URL = "https://theme.piggietv.com/assets/icon/discord.svg";
  const REQUEST_ICON_URL = "https://theme.piggietv.com/assets/icon/request.svg";
  const BROWSER_ICON_URL = "https://theme.piggietv.com/assets/icon/browser-icon.ico";

  const APPS = [
    { id: "request", title: "Request", url: "https://request.piggietv.com", iconUrl: REQUEST_ICON_URL },
    { id: "games", title: "Games", url: "https://emu.piggietv.com", materialIcon: "sports_esports" },
    { id: "library", title: "Library", url: "https://books.piggietv.com", materialIcon: "menu_book" }
  ];

  const BACKDROP_ROOT_ID = "ptv-backdrop-root";
  const BACKDROP_A_ID = "ptv-backdrop-a";
  const BACKDROP_B_ID = "ptv-backdrop-b";

  const IDLE_DELAY = 12000;
  const SLIDESHOW_DELAY = 8000;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const text = (el) => (el?.textContent || "").trim().toLowerCase();

  let scheduled = false;
  let lastUrl = location.href;

  let backdropResetTimer = null;
  let backdropSwapTimer = null;
  let activeBackdropUrl = "";

  let idleTimer = null;
  let idleModeActive = false;
  let slideshowTimer = null;
  let slideshowIndex = 0;
  let slideshowItems = [];

  let domObserver = null;
  let backdropRootObserver = null;

  function isLoginPage() {
    return location.hash.includes("#/login");
  }

  function isHomePage() {
    return location.hash.includes("#/home") || !!qs(".homePage");
  }

  function scheduleRun() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      run();
    });
  }

  function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function getApiClient() {
    return window.ApiClient || window.apiClient || null;
  }

  function getServerAddress() {
    const api = getApiClient();
    if (!api) return "";
    if (typeof api.serverAddress === "function") return api.serverAddress() || "";
    if (typeof api._serverAddress === "string") return api._serverAddress || "";
    return "";
  }

  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      if (!url) return reject(new Error("No URL"));
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error("Failed to load " + url));
      img.src = url;
    });
  }

  function setGlow(rgb) {
    document.documentElement.style.setProperty("--ptv-home-glow-rgb", rgb || "143, 124, 255");
  }

  function replaceBrowserTabIcon() {
    const head = document.head;
    if (!head) return;

    let icon = qs("#ptv-browser-icon", head);
    if (!icon) {
      icon = document.createElement("link");
      icon.id = "ptv-browser-icon";
      icon.rel = "icon";
      icon.type = "image/x-icon";
      head.appendChild(icon);
    }
    icon.href = BROWSER_ICON_URL;

    let shortcut = qs("#ptv-browser-shortcut-icon", head);
    if (!shortcut) {
      shortcut = document.createElement("link");
      shortcut.id = "ptv-browser-shortcut-icon";
      shortcut.rel = "shortcut icon";
      shortcut.type = "image/x-icon";
      head.appendChild(shortcut);
    }
    shortcut.href = BROWSER_ICON_URL;
  }

  function makeSvgIcon(url, alt = "") {
    return `<img class="ptv-nav-icon ptv-nav-icon-svg" src="${url}" alt="${alt}" onerror="this.style.display='none'">`;
  }

  function makeMaterialIcon(name) {
    return `<span class="material-icons navMenuOptionIcon">${name}</span>`;
  }

  function getSidebarNav() {
    return (
      qs(".mainDrawer .navMenu") ||
      qs(".mainDrawer .drawerContent .navMenu") ||
      qs(".mainDrawer .scrollContainer .navMenu") ||
      qs(".mainDrawer .mainDrawer-scrollContainer .navMenu") ||
      null
    );
  }

  function injectHeaderLogo() {
    const headerLeft =
      qs(".skinHeader .headerLeft") ||
      qs(".skinHeader .headerTop") ||
      null;

    if (!headerLeft) return;

    const existing = qs("#ptv-header-logo");
    if (existing && existing.closest(".skinHeader")) return;
    if (existing) existing.remove();

    const logo = document.createElement("div");
    logo.id = "ptv-header-logo";

    const link = document.createElement("a");
    link.href = "#/home";
    link.className = "ptv-header-logo-link";

    const img = document.createElement("img");
    img.src = LOGO_URL;
    img.alt = "PiggieTV";

    img.onerror = function () {
      console.warn("PiggieTV header logo failed:", LOGO_URL);
      logo.remove();
    };

    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.hash = "#/home";
    });

    link.appendChild(img);
    logo.appendChild(link);

    if (headerLeft.classList.contains("headerLeft")) {
      headerLeft.insertBefore(logo, headerLeft.firstChild);
    } else {
      const firstButton = headerLeft.querySelector(".headerButtonLeft, .headerButton");
      if (firstButton && firstButton.parentNode === headerLeft) {
        firstButton.insertAdjacentElement("afterend", logo);
      } else {
        headerLeft.insertBefore(logo, headerLeft.firstChild);
      }
    }
  }

  function ensureSidebarLogo(nav) {
    if (!nav || qs("#ptv-sidebar-logo", nav)) return;

    const logo = document.createElement("div");
    logo.id = "ptv-sidebar-logo";
    logo.innerHTML = `<img src="${LOGO_URL}" alt="PiggieTV" onerror="this.style.display='none'">`;
    nav.prepend(logo);
  }

  function ensureDiscordLink(nav) {
    if (!nav || qs("#ptv-discord-sidebar-link", nav)) return;

    const link = document.createElement("a");
    link.id = "ptv-discord-sidebar-link";
    link.href = DISCORD_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "navMenuOption lnk ptv-custom-nav-link";
    link.innerHTML = `
      ${makeSvgIcon(DISCORD_ICON_URL, "Discord")}
      <span class="navMenuOptionText">Discord</span>
    `;

    nav.appendChild(link);
  }

  function ensureAppsSection(nav) {
    if (!nav) return null;

    let section = qs("#ptv-apps-section", nav);
    if (section) return section;

    section = document.createElement("div");
    section.id = "ptv-apps-section";

    const header = document.createElement("div");
    header.className = "navMenuHeader";
    header.textContent = "Apps";

    const list = document.createElement("div");
    list.className = "ptv-apps-links";

    section.appendChild(header);
    section.appendChild(list);
    nav.appendChild(section);

    return section;
  }

  function makeSidebarAppLink(app) {
    const link = document.createElement("a");
    link.id = `ptv-link-${app.id}`;
    link.href = app.url;
    link.className = "navMenuOption lnk ptv-custom-nav-link";

    const iconHtml = app.iconUrl
      ? makeSvgIcon(app.iconUrl, app.title)
      : makeMaterialIcon(app.materialIcon || "apps");

    link.innerHTML = `
      ${iconHtml}
      <span class="navMenuOptionText">${app.title}</span>
    `;

    link.addEventListener("click", function (e) {
      e.preventDefault();
      openExternal(app.url);
    });

    return link;
  }

  function injectSidebarApps() {
    const nav = getSidebarNav();
    if (!nav) return false;

    ensureSidebarLogo(nav);
    ensureDiscordLink(nav);

    const section = ensureAppsSection(nav);
    const list = qs(".ptv-apps-links", section);
    if (!list) return false;

    APPS.forEach(function (app) {
      if (!qs(`#ptv-link-${app.id}`, list)) {
        list.appendChild(makeSidebarAppLink(app));
      }
    });

    return true;
  }

  function bindDrawerInjection() {
    if (document.body.dataset.ptvDrawerBound === "1") return;
    document.body.dataset.ptvDrawerBound = "1";

    function injectOnceDrawerReady() {
      let tries = 0;
      const timer = setInterval(() => {
        tries++;

        const drawer = qs(".mainDrawer");
        const nav = getSidebarNav();

        if (drawer && nav) {
          injectSidebarApps();
          clearInterval(timer);
          return;
        }

        if (tries >= 20) {
          clearInterval(timer);
        }
      }, 80);
    }

    document.addEventListener("click", function (e) {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const clickedMenuButton =
        target.closest(".headerButton.headerButtonLeft") ||
        target.closest(".mainDrawerButton") ||
        target.closest("[aria-label*='Menu']") ||
        target.closest("[title*='Menu']");

      if (clickedMenuButton) {
        injectOnceDrawerReady();
      }
    }, true);
  }

  function cleanupLogin() {
    document.body.classList.remove("ptv-native-login-page");
    qs("#ptv-native-login-brand")?.remove();
    qs("#ptv-native-extra-buttons")?.remove();
  }

  function bindLoginGlow(form) {
    if (!form || form.dataset.ptvGlowBound === "1") return;
    form.dataset.ptvGlowBound = "1";

    form.addEventListener("mousemove", (e) => {
      const rect = form.getBoundingClientRect();
      form.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      form.style.setProperty("--my", `${e.clientY - rect.top}px`);
      form.classList.add("ptv-glow-active");
    });

    form.addEventListener("mouseleave", () => {
      form.classList.remove("ptv-glow-active");
    });
  }

  function relabelLoginButtons(root = document) {
    qsa("button, a, .navMenuOptionText", root).forEach((el) => {
      const value = (el.textContent || "").trim();
      if (value === "Password Reset" || value === "password reset") {
        el.textContent = "Forgot Password";
      }
    });
  }

  function hideQuickConnect(root = document) {
    qsa("button, a", root).forEach((el) => {
      if (text(el).includes("quick connect")) {
        el.style.display = "none";
      }
    });
  }

  function injectLogin() {
    if (!isLoginPage()) {
      cleanupLogin();
      return;
    }

    const form = qs(".manualLoginForm") || qs(".loginForm");
    if (!form) return;

    document.body.classList.add("ptv-native-login-page");

    if (!qs("#ptv-native-login-brand")) {
      const brand = document.createElement("div");
      brand.id = "ptv-native-login-brand";
      brand.innerHTML = `
        <img src="${LOGO_URL}" alt="PiggieTV">
        <div class="ptv-tagline">MOVIES • TV SHOWS • ANIME</div>
      `;
      form.prepend(brand);
    }

    if (!qs("#ptv-native-extra-buttons")) {
      const wrap = document.createElement("div");
      wrap.id = "ptv-native-extra-buttons";
      wrap.innerHTML = `
        <div class="ptv-row">
          <a class="ptv-btn" href="${SIGNUP_URL}" target="_blank" rel="noopener noreferrer">Sign Up</a>
          <a class="ptv-btn" href="${FORGOT_URL}" target="_blank" rel="noopener noreferrer">Forgot Password</a>
        </div>
        <a class="ptv-btn ptv-discord" href="${DISCORD_URL}" target="_blank" rel="noopener noreferrer">Discord</a>
      `;
      form.appendChild(wrap);
    }

    relabelLoginButtons(form);
    hideQuickConnect(form);
    bindLoginGlow(form);
  }

  function ensureBackdropRoot() {
    let root = qs(`#${BACKDROP_ROOT_ID}`);
    if (root) return root;

    root = document.createElement("div");
    root.id = BACKDROP_ROOT_ID;
    root.innerHTML = `
      <div id="${BACKDROP_A_ID}" class="ptv-backdrop-layer is-active"></div>
      <div id="${BACKDROP_B_ID}" class="ptv-backdrop-layer"></div>
      <div class="ptv-backdrop-overlay"></div>
    `;

    document.body.prepend(root);
    return root;
  }

  function getBackdropLayers() {
    return {
      a: qs(`#${BACKDROP_A_ID}`),
      b: qs(`#${BACKDROP_B_ID}`)
    };
  }

  function swapBackdrop(url) {
    ensureBackdropRoot();

    const { a, b } = getBackdropLayers();
    if (!a || !b) return;

    const aActive = a.classList.contains("is-active");
    const activeLayer = aActive ? a : b;
    const nextLayer = aActive ? b : a;

    nextLayer.style.backgroundImage = `url("${url}")`;
    nextLayer.classList.add("is-active");
    activeLayer.classList.remove("is-active");
  }

  function setBackdropFromUrl(url) {
    if (!url || url === activeBackdropUrl) return;

    clearTimeout(backdropSwapTimer);
    backdropSwapTimer = setTimeout(async function () {
      try {
        await preloadImage(url);
        swapBackdrop(url);
        activeBackdropUrl = url;
      } catch (_) {}
    }, 80);
  }

  function resetBackdrop() {
    setBackdropFromUrl(DEFAULT_BACKDROP_URL);
  }

  function extractIdFromString(value) {
    if (!value) return "";

    const patterns = [
      /[?&]id=([a-zA-Z0-9]+)/,
      /\/details\?id=([a-zA-Z0-9]+)/,
      /\/items\/([a-zA-Z0-9]+)/i,
      /\/server\/items\/([a-zA-Z0-9]+)/i
    ];

    for (const pattern of patterns) {
      const match = value.match(pattern);
      if (match?.[1]) return match[1];
    }

    return "";
  }

  function getItemIdFromCard(card) {
    if (!card) return "";

    const direct =
      card.getAttribute("data-id") ||
      card.getAttribute("data-itemid") ||
      card.getAttribute("data-item-id");

    if (direct) return direct;

    const nested = card.querySelector("[data-id],[data-itemid],[data-item-id]");
    if (nested) {
      const nestedId =
        nested.getAttribute("data-id") ||
        nested.getAttribute("data-itemid") ||
        nested.getAttribute("data-item-id");
      if (nestedId) return nestedId;
    }

    const link = card.closest("a") || card.querySelector("a");
    if (link?.href) {
      const id = extractIdFromString(link.href);
      if (id) return id;
    }

    const img = card.querySelector("img");
    if (img?.src) {
      const id = extractIdFromString(img.src);
      if (id) return id;
    }

    return "";
  }

  function buildBackdropUrl(itemId) {
    const base = getServerAddress();
    if (!base || !itemId) return "";
    return `${base.replace(/\/$/, "")}/Items/${itemId}/Images/Backdrop/0?maxWidth=1920&quality=90`;
  }

  function pickGlowColorFromCard(card) {
    const title = (
      card.querySelector(".cardText")?.textContent ||
      card.querySelector(".cardFooter")?.textContent ||
      ""
    ).trim().toLowerCase();

    if (title.includes("dragon")) return "255, 153, 64";
    if (title.includes("pokemon")) return "86, 170, 255";
    if (title.includes("stone")) return "120, 220, 160";
    if (title.includes("ghost")) return "160, 120, 255";
    if (title.includes("fire")) return "255, 110, 90";
    if (title.includes("slime")) return "110, 220, 255";
    if (title.includes("dorohedoro")) return "255, 90, 110";
    if (title.includes("classroom")) return "255, 160, 210";
    return "143, 124, 255";
  }

  function getHomeCards() {
    return qsa(".homePage .card, .homePage .cardBox, .homePage .cardScalable, .homePage .emby-card");
  }

  function getBackdropCandidates() {
    const seen = new Set();
    const candidates = [];

    getHomeCards().forEach((card) => {
      const itemId = getItemIdFromCard(card);
      if (!itemId || seen.has(itemId)) return;

      const backdropUrl = buildBackdropUrl(itemId);
      if (!backdropUrl) return;

      seen.add(itemId);
      candidates.push({
        itemId,
        backdropUrl,
        glow: pickGlowColorFromCard(card)
      });
    });

    return candidates;
  }

  function stopIdleSlideshow() {
    idleModeActive = false;
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }

  function showIdleSlide() {
    if (!isHomePage() || !slideshowItems.length) return;

    const item = slideshowItems[slideshowIndex % slideshowItems.length];
    slideshowIndex++;

    setGlow(item.glow || "143, 124, 255");
    setBackdropFromUrl(item.backdropUrl);
  }

  function startIdleSlideshow() {
    if (!isHomePage()) return;

    slideshowItems = getBackdropCandidates();
    if (!slideshowItems.length) return;

    stopIdleSlideshow();
    idleModeActive = true;
    slideshowIndex = Math.floor(Math.random() * slideshowItems.length);

    showIdleSlide();

    slideshowTimer = setInterval(() => {
      if (!idleModeActive || !isHomePage()) return;
      showIdleSlide();
    }, SLIDESHOW_DELAY);
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    stopIdleSlideshow();

    if (!isHomePage()) return;

    idleTimer = setTimeout(() => {
      startIdleSlideshow();
    }, IDLE_DELAY);
  }

  function bindIdleListeners() {
    if (document.body.dataset.ptvIdleBound === "1") return;
    document.body.dataset.ptvIdleBound = "1";

    ["mousemove", "mousedown", "keydown", "touchstart", "wheel", "scroll"].forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    });
  }

  function activateHomeCard(card) {
    if (!isHomePage()) return;

    clearTimeout(backdropResetTimer);
    clearTimeout(idleTimer);
    stopIdleSlideshow();

    const itemId = getItemIdFromCard(card);
    const glow = pickGlowColorFromCard(card);
    setGlow(glow);

    if (!itemId) return;

    const backdropUrl = buildBackdropUrl(itemId);
    if (!backdropUrl) return;

    setBackdropFromUrl(backdropUrl);
  }

  function deactivateHomeCard() {
    clearTimeout(backdropResetTimer);
    backdropResetTimer = setTimeout(() => {
      setGlow("143, 124, 255");
      resetIdleTimer();
    }, 600);
  }

  function bindHomeBackdropCards() {
    getHomeCards().forEach((card) => {
      if (card.dataset.ptvBackdropBound === "1") return;
      card.dataset.ptvBackdropBound = "1";

      card.addEventListener("mouseenter", () => activateHomeCard(card));
      card.addEventListener("focusin", () => activateHomeCard(card));
      card.addEventListener("mouseleave", deactivateHomeCard);
      card.addEventListener("focusout", deactivateHomeCard);
    });
  }

  function setInitialHomeBackdrop() {
    if (!isHomePage()) return;

    const firstCard = qs(".homePage .card, .homePage .cardBox, .homePage .cardScalable, .homePage .emby-card");
    if (firstCard) {
      activateHomeCard(firstCard);
      resetIdleTimer();
    } else {
      resetBackdrop();
    }
  }

  function startBackdropRootObserver() {
    if (backdropRootObserver) return;

    backdropRootObserver = new MutationObserver(() => {
      if (!qs(`#${BACKDROP_ROOT_ID}`)) {
        ensureBackdropRoot();
        if (!activeBackdropUrl) resetBackdrop();
        else swapBackdrop(activeBackdropUrl);
      }
    });

    backdropRootObserver.observe(document.body, { childList: true });
  }

  function initHomeBackdrop() {
    ensureBackdropRoot();
    startBackdropRootObserver();
    bindIdleListeners();

    if (!isHomePage()) {
      stopIdleSlideshow();
      clearTimeout(idleTimer);
      return;
    }

    bindHomeBackdropCards();
    setInitialHomeBackdrop();
  }

  function injectTopRequestTabIcon() {
    const requestTab = qsa(".emby-tab-button, .headerTabButton, button, a").find((el) => text(el) === "request");
    if (!requestTab) return;
    if (qs(".ptv-request-tab-icon", requestTab)) return;

    const icon = document.createElement("img");
    icon.className = "ptv-request-tab-icon";
    icon.src = REQUEST_ICON_URL;
    icon.alt = "Request";
    icon.style.width = "14px";
    icon.style.height = "14px";
    icon.style.marginRight = "6px";
    icon.style.verticalAlign = "middle";
    icon.style.display = "inline-block";
    icon.onerror = function () {
      icon.style.display = "none";
    };

    requestTab.prepend(icon);
  }

  function run() {
    replaceBrowserTabIcon();
    injectHeaderLogo();
    injectLogin();
    relabelLoginButtons(document);
    injectTopRequestTabIcon();
    initHomeBackdrop();
    bindDrawerInjection();
  }

  function boot() {
    run();

    domObserver = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        scheduleRun();
        return;
      }

      scheduleRun();
    });

    domObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.addEventListener("load", run);
    window.addEventListener("hashchange", () => {
      setTimeout(scheduleRun, 120);
      setTimeout(scheduleRun, 500);
    });

    document.addEventListener("viewshow", () => {
      setTimeout(scheduleRun, 120);
      setTimeout(scheduleRun, 500);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();