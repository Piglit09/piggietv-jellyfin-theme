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