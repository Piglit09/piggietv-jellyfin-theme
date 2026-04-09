window.PTV = window.PTV || {};

window.PTV.pulseSignIn = function () {
  const submitBtn = window.PTV.getSubmitButton();
  if (!submitBtn) return;

  submitBtn.classList.remove("ptv-enter-pulse");
  void submitBtn.offsetWidth;
  submitBtn.classList.add("ptv-enter-pulse");

  window.setTimeout(() => {
    submitBtn.classList.remove("ptv-enter-pulse");
  }, 700);
};

window.PTV.bindEnterPulse = function () {
  if (!document.body || document.body.dataset.ptvEnterBound === "1") return;
  document.body.dataset.ptvEnterBound = "1";

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    if (!document.querySelector("#loginPage")) return;

    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") {
      window.PTV.pulseSignIn();
    }
  });
};

window.PTV.runLoginEnhancements = function () {
  window.PTV.injectLoginHeader();
  window.PTV.injectLoginButtons();
  window.PTV.autofocusUsername();
};