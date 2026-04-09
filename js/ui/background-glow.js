window.PTV = window.PTV || {};

window.PTV.ensureBackgroundGlowLayer = function () {
  const loginPage = document.querySelector("#loginPage");
  if (!loginPage) return null;

  let glow = document.getElementById("ptv-bg-glow");
  if (!glow) {
    glow = document.createElement("div");
    glow.id = "ptv-bg-glow";
    loginPage.appendChild(glow);
  }

  return glow;
};

window.PTV.bindBackgroundHover = function () {
  if (!document.body || document.body.dataset.ptvBgBound === "1") return;
  document.body.dataset.ptvBgBound = "1";

  const updateGlow = (event) => {
    const glow = window.PTV.ensureBackgroundGlowLayer();
    if (!glow) return;

    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;

    glow.style.setProperty("--ptv-x", `${x}%`);
    glow.style.setProperty("--ptv-y", `${y}%`);
  };

  window.addEventListener("mousemove", updateGlow, { passive: true });
};