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