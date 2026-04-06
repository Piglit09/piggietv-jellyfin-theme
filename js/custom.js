(function () {
  const LOGO_URL = "https://piggietv.com/web/assets/img/banner-light.png";
  const DISCORD_URL = "https://discord.gg/FbtexGYau";
  const SIGNUP_URL = "https://signup.piggietv.com/invite/ysBDoDSMpv5fFMz9GPMxUL";
  const FORGOT_URL = "https://signup.piggietv.com/my/account";

  const APPS = {
    request: {
      id: "request",
      title: "Request",
      url: "https://request.piggietv.com",
      icon: "movie"
    },
    games: {
      id: "games",
      title: "Games",
      url: "https://emu.piggietv.com",
      icon: "sports_esports"
    },
    library: {
      id: "library",
      title: "Library",
      url: "https://books.piggietv.com",
      icon: "menu_book"
    }
  };

  const SIDEBAR_APPS = [APPS.request, APPS.games, APPS.library];

  let lastUrl = location.href;
  let scheduled = false;

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function text(el) {
    return (el?.textContent || "").trim().toLowerCase();
  }

  function isLoginPage() {
    return location.hash.includes("#/login");
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
      <span class="navMenuOptionIcon"></span>
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
    const signOut = qsa(".navMenuOption, a.navMenuOption", nav).find(el =>
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

  function openAppDirect(app) {
    window.open(app.url, "_blank", "noopener,noreferrer");
  }

  function makeSidebarAppLink(app) {
    const a = document.createElement("a");
    a.id = `ptv-link-${app.id}`;
    a.href = app.url;
    a.className = "navMenuOption lnk";
    a.innerHTML = `
      <span class="material-icons navMenuOptionIcon">${app.icon}</span>
      <span class="navMenuOptionText">${app.title}</span>
    `;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      openAppDirect(app);
    });

    return a;
  }

  function injectSidebarApps() {
    const nav = getSidebarNav();
    if (!nav) return;

    ensureSidebarLogo(nav);
    ensureDiscordLink(nav);

    const section = ensureAppsSection(nav);
    const list = qs(".ptv-apps-links", section);
    if (!list) return;

    SIDEBAR_APPS.forEach(app => {
      if (!qs(`#ptv-link-${app.id}`, list)) {
        list.appendChild(makeSidebarAppLink(app));
      }
    });
  }

  function cleanupSidebarDuplicates() {
    ["#ptv-sidebar-logo", "#ptv-discord-sidebar-link", "#ptv-apps-section"].forEach(sel => {
      qsa(sel).forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
    });

    SIDEBAR_APPS.forEach(app => {
      qsa(`#ptv-link-${app.id}`).forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
    });
  }

  function cleanupOldTopRequestTab() {
    qsa("#ptv-top-tab-request").forEach(el => el.remove());
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

    qsa("button, a").forEach((el) => {
      const txt = text(el);

      if (txt === "password reset") {
        el.textContent = "Forgot Password";
      }

      if (txt.includes("quick connect")) {
        el.style.display = "none";
      }
    });

    bindLoginGlow(form);
  }

  function relabel() {
    qsa("button, a, .navMenuOptionText").forEach((el) => {
      if ((el.textContent || "").trim() === "Password Reset") {
        el.textContent = "Forgot Password";
      }
    });
  }

  function run() {
    cleanupOldTopRequestTab();
    injectSidebarApps();
    cleanupSidebarDuplicates();
    injectLogin();
    relabel();
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

    const missingLoginBits =
      isLoginPage() && !qs("#ptv-native-login-brand");

    if (missingSidebarBits || missingLoginBits) {
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