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