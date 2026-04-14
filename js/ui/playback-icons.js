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