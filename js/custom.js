(function () {
  "use strict";

  const LOGO_URL = "https://theme.piggietv.com/assets/logo/banner-light.png";
  const DISCORD_URL = "https://discord.gg/FbtexGYau";
  const REQUEST_ICON_URL = "https://theme.piggietv.com/assets/icons/request.svg";
  const DISCORD_ICON_URL = "https://theme.piggietv.com/assets/icons/discord.svg";

  const APPS = [
    {
      id: "request",
      title: "Request",
      url: "https://request.piggietv.com",
      iconUrl: REQUEST_ICON_URL
    },
    {
      id: "games",
      title: "Games",
      url: "https://emu.piggietv.com",
      materialIcon: "sports_esports"
    },
    {
      id: "library",
      title: "Library",
      url: "https://books.piggietv.com",
      materialIcon: "menu_book"
    }
  ];

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function createSvgIcon(url, alt, fallbackMaterialIcon) {
    const wrap = document.createElement("span");
    wrap.className = "ptv-nav-icon-wrap";

    const img = document.createElement("img");
    img.className = "ptv-nav-icon ptv-nav-icon-svg";
    img.src = url;
    img.alt = alt || "";
    img.width = 20;
    img.height = 20;

    img.onerror = function () {
      img.remove();
      if (fallbackMaterialIcon) {
        const fallback = document.createElement("span");
        fallback.className = "material-icons navMenuOptionIcon";
        fallback.textContent = fallbackMaterialIcon;
        wrap.appendChild(fallback);
      }
    };

    wrap.appendChild(img);
    return wrap;
  }

  function createMaterialIcon(name) {
    const wrap = document.createElement("span");
    wrap.className = "ptv-nav-icon-wrap";

    const span = document.createElement("span");
    span.className = "material-icons navMenuOptionIcon";
    span.textContent = name || "apps";

    wrap.appendChild(span);
    return wrap;
  }

  function injectHeaderLogo() {
    const headerLeft =
      qs(".skinHeader .headerLeft") ||
      qs(".skinHeader .headerTop");

    if (!headerLeft) return;
    if (qs("#ptv-header-logo", headerLeft)) return;

    const logo = document.createElement("div");
    logo.id = "ptv-header-logo";

    const link = document.createElement("a");
    link.href = "#/home";
    link.className = "ptv-header-logo-link";

    const img = document.createElement("img");
    img.src = LOGO_URL;
    img.alt = "PiggieTV";
    img.onerror = function () {
      logo.remove();
    };

    link.onclick = function (e) {
      e.preventDefault();
      window.location.hash = "#/home";
    };

    link.appendChild(img);
    logo.appendChild(link);
    headerLeft.insertBefore(logo, headerLeft.firstChild);
  }

  function getSidebarRoot() {
    return qs(".mainDrawer-scrollContainer");
  }

  function buildSidebarAppLink(app) {
    const link = document.createElement("a");
    link.id = `ptv-link-${app.id}`;
    link.href = app.url;
    link.className = "navMenuOption emby-button lnk ptv-custom-nav-link";

    const iconNode = app.iconUrl
      ? createSvgIcon(app.iconUrl, app.title, app.materialIcon || "apps")
      : createMaterialIcon(app.materialIcon || "apps");

    const textNode = document.createElement("span");
    textNode.className = "navMenuOptionText";
    textNode.textContent = app.title;

    link.appendChild(iconNode);
    link.appendChild(textNode);

    link.onclick = function (e) {
      e.preventDefault();
      openExternal(app.url);
    };

    return link;
  }

  function buildDiscordLink() {
    const link = document.createElement("a");
    link.id = "ptv-discord-sidebar-link";
    link.href = DISCORD_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "navMenuOption emby-button lnk ptv-custom-nav-link";

    const iconNode = createSvgIcon(DISCORD_ICON_URL, "Discord", "forum");

    const textNode = document.createElement("span");
    textNode.className = "navMenuOptionText";
    textNode.textContent = "Discord";

    link.appendChild(iconNode);
    link.appendChild(textNode);

    return link;
  }

  function injectSidebar() {
    const root = getSidebarRoot();
    if (!root) return false;

    if (!qs("#ptv-sidebar-logo", root)) {
      const logo = document.createElement("div");
      logo.id = "ptv-sidebar-logo";

      const img = document.createElement("img");
      img.src = LOGO_URL;
      img.alt = "PiggieTV";
      img.onerror = function () {
        logo.remove();
      };

      logo.appendChild(img);

      const spacer = root.firstElementChild;
      if (spacer) {
        spacer.insertAdjacentElement("afterend", logo);
      } else {
        root.prepend(logo);
      }
    }

    let section = qs("#ptv-apps-section", root);
    if (!section) {
      section = document.createElement("div");
      section.id = "ptv-apps-section";

      const header = document.createElement("h3");
      header.className = "sidebarHeader";
      header.textContent = "Apps";

      const list = document.createElement("div");
      list.className = "ptv-apps-links";

      section.appendChild(header);
      section.appendChild(list);
      root.appendChild(section);
    }

    const list = qs(".ptv-apps-links", section);
    if (list) {
      APPS.forEach((app) => {
        if (!qs(`#ptv-link-${app.id}`, list)) {
          list.appendChild(buildSidebarAppLink(app));
        }
      });
    }

    if (!qs("#ptv-discord-sidebar-link", root)) {
      root.appendChild(buildDiscordLink());
    }

    return true;
  }

  function injectTopRequestTabIcon() {
    const requestTab = qsa(".emby-tab-button, .headerTabButton, button, a").find(
      (el) => (el.textContent || "").trim().toLowerCase() === "request"
    );

    if (!requestTab || qs(".ptv-request-tab-icon", requestTab)) return;

    const icon = document.createElement("img");
    icon.className = "ptv-request-tab-icon";
    icon.src = REQUEST_ICON_URL;
    icon.alt = "Request";
    icon.style.width = "14px";
    icon.style.height = "14px";
    icon.style.marginRight = "6px";
    icon.style.verticalAlign = "middle";
    icon.onerror = function () {
      icon.remove();
    };

    requestTab.prepend(icon);
  }
function setBrowserIcon() {
  const head = document.head;
  if (!head) return;

  const ICON_URL = "https://theme.piggietv.com/assets/icons/browser-icon.png";

  // Remove Jellyfin icons ONCE
  if (!head.dataset.ptvIconCleaned) {
    head.dataset.ptvIconCleaned = "1";

    head.querySelectorAll('link[rel*="icon"]').forEach(el => {
      el.remove();
    });
  }

  // Add ours
  if (!head.querySelector("#ptv-favicon")) {
    const link = document.createElement("link");
    link.id = "ptv-favicon";
    link.rel = "icon";
    link.type = "image/png";
    link.href = ICON_URL + "?v=" + Date.now();

    head.appendChild(link);
  }
}

  function runSafe() {
    setBrowserIcon();
    injectHeaderLogo();
    injectSidebar();
    injectTopRequestTabIcon();
  }

  function boot() {
    runSafe();

    document.addEventListener("click", function () {
      setTimeout(runSafe, 120);
      setTimeout(runSafe, 400);
    }, true);

    window.addEventListener("hashchange", function () {
      setTimeout(runSafe, 150);
      setTimeout(runSafe, 500);
    });

    document.addEventListener("viewshow", function () {
      setTimeout(runSafe, 150);
      setTimeout(runSafe, 500);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();