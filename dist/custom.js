(function () {
  const LOGO_URL = "https://theme.piggietv.com/assets/logo/banner-light.png";
  const DISCORD_URL = "https://discord.gg/FbtexGYau";
  const SIGNUP_URL = "https://signup.piggietv.com/invite/ysBDoDSMpv5fFMz9GPMxUL";
  const FORGOT_URL = "https://signup.piggietv.com/my/account";

  const APPS = [
    {
      id: "request",
      title: "Request",
      url: "https://request.piggietv.com",
      icon: "movie"
    },
    {
      id: "games",
      title: "Games",
      url: "https://emu.piggietv.com",
      icon: "sports_esports"
    },
    {
      id: "library",
      title: "Library",
      url: "https://books.piggietv.com",
      icon: "menu_book"
    }
  ];

  let lastUrl = location.href;
  let scheduled = false;
  let backdropResetTimer = null;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const text = (el) => (el?.textContent || "").trim().toLowerCase();

  function isLoginPage() {
    return location.hash.includes("#/login");
  }

  function isHomePage() {
    return (
      location.hash.includes("#/home") ||
      !!qs(".homePage")
    );
  }

  function scheduleRun() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      run();
    });
  }

  function getSidebarNav() {
    return (
      qs(".mainDrawer .navMenu") ||
      qs(".mainDrawer-scrollContainer") ||
      qs(".drawerContent")
    );
  }

  function ensureSidebarLogo(nav) {
    if (!nav || qs("#ptv-sidebar-logo", nav)) return;

    const logo = document.createElement("div");
    logo.id = "ptv-sidebar-logo";
    logo.innerHTML = `<img src="${LOGO_URL}" alt="PiggieTV">`;
    nav.prepend(logo);
  }

  function ensureDiscordLink(nav) {
    if (!nav || qs("#ptv-discord-sidebar-link", nav)) return;

    const link = document.createElement("a");
    link.id = "ptv-discord-sidebar-link";
    link.href = DISCORD_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "navMenuOption lnk";
    link.innerHTML = `
      <span class="material-icons navMenuOptionIcon">forum</span>
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

    const discord = qs("#ptv-discord-sidebar-link", nav);
    const signOut = qsa(".navMenuOption, a.navMenuOption", nav).find((el) =>
      text(el).includes("sign out")
    );

    if (discord && discord.parentNode === nav) {
      nav.insertBefore(section, discord);
    } else if (signOut && signOut.parentNode === nav) {
      nav.insertBefore(section, signOut);
    } else {
      nav.appendChild(section);
    }

    return section;
  }

  function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function makeSidebarAppLink(app) {
    const link = document.createElement("a");
    link.id = `ptv-link-${app.id}`;
    link.href = app.url;
    link.className = "navMenuOption lnk";
    link.innerHTML = `
      <span class="material-icons navMenuOptionIcon">${app.icon}</span>
      <span class="navMenuOptionText">${app.title}</span>
    `;

    link.addEventListener("click", (e) => {
      e.preventDefault();
      openExternal(app.url);
    });

    return link;
  }

  function injectSidebarApps() {
    const nav = getSidebarNav();
    if (!nav) return;

    ensureSidebarLogo(nav);
    ensureDiscordLink(nav);

    const section = ensureAppsSection(nav);
    const list = qs(".ptv-apps-links", section);
    if (!list) return;

    APPS.forEach((app) => {
      if (!qs(`#ptv-link-${app.id}`, list)) {
        list.appendChild(makeSidebarAppLink(app));
      }
    });
  }

  function cleanupSidebarDuplicates() {
    ["#ptv-sidebar-logo", "#ptv-discord-sidebar-link", "#ptv-apps-section"].forEach((sel) => {
      qsa(sel).forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
    });

    APPS.forEach((app) => {
      qsa(`#ptv-link-${app.id}`).forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
    });
  }

  function cleanupOldInjectedBits() {
    qsa("#ptv-top-tab-request").forEach((el) => el.remove());
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
        <img src="${LOGO_URL}" alt="PiggieTV" />
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

  function setGlow(rgb) {
    document.documentElement.style.setProperty(
      "--ptv-home-glow-rgb",
      rgb || "143, 124, 255"
    );
  }

  function setBackdropFromUrl(url) {
    const bg = qs(".backgroundContainer");
    if (!bg || !url) return;
    bg.style.backgroundImage = `url("${url}")`;
  }

  function extractUrlFromBackgroundImage(bgValue) {
    if (!bgValue || bgValue === "none") return "";
    const match = bgValue.match(/url\((['"]?)(.*?)\1\)/);
    return match?.[2] || "";
  }

  function extractBestImageFromCard(card) {
    if (!card) return "";

    const img =
      card.querySelector(".cardImage img") ||
      card.querySelector(".cardImageContainer img") ||
      card.querySelector("img");

    if (img?.currentSrc) return img.currentSrc;
    if (img?.src) return img.src;

    const cardImage = card.querySelector(".cardImage");
    if (cardImage) {
      const bg = getComputedStyle(cardImage).backgroundImage;
      const url = extractUrlFromBackgroundImage(bg);
      if (url) return url;
    }

    return "";
  }

  function pickGlowColorFromCard(card) {
    const title =
      (
        card.querySelector(".cardText")?.textContent ||
        card.querySelector(".cardFooter")?.textContent ||
        ""
      )
        .trim()
        .toLowerCase();

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

  function activateHomeCard(card) {
    if (!isHomePage()) return;

    clearTimeout(backdropResetTimer);

    const url = extractBestImageFromCard(card);
    const rgb = pickGlowColorFromCard(card);

    setGlow(rgb);
    if (url) setBackdropFromUrl(url);
  }

  function deactivateHomeCard() {
    clearTimeout(backdropResetTimer);
    backdropResetTimer = setTimeout(() => {
      setGlow("143, 124, 255");
    }, 180);
  }

  function bindHomeBackdropCards() {
    qsa(".homePage .cardBox, .homePage .cardScalable").forEach((card) => {
      if (card.dataset.ptvBackdropBound === "1") return;
      card.dataset.ptvBackdropBound = "1";

      card.addEventListener("mouseenter", () => activateHomeCard(card));
      card.addEventListener("focusin", () => activateHomeCard(card));
      card.addEventListener("mouseleave", deactivateHomeCard);
      card.addEventListener("focusout", deactivateHomeCard);
    });
  }

  function run() {
    cleanupOldInjectedBits();
    injectSidebarApps();
    cleanupSidebarDuplicates();
    injectLogin();
    relabelLoginButtons(document);
    bindHomeBackdropCards();
  }

  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      scheduleRun();
      return;
    }

    const missingSidebarBits =
      !qs("#ptv-sidebar-logo") ||
      !qs("#ptv-discord-sidebar-link") ||
      !qs("#ptv-apps-section") ||
      !qs("#ptv-link-request") ||
      !qs("#ptv-link-games") ||
      !qs("#ptv-link-library");

    const missingLoginBits = isLoginPage() && !qs("#ptv-native-login-brand");

    if (missingSidebarBits || missingLoginBits || isHomePage()) {
      scheduleRun();
    }
  });

  window.addEventListener("load", run);
  window.addEventListener("hashchange", scheduleRun);

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  run();
})();