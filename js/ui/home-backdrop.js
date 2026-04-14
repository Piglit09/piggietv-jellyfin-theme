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