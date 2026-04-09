window.PTV = window.PTV || {};

window.PTV.autofocusUsername = function () {
  const input = window.PTV.getUsernameInput();
  if (!input) return;

  const alreadyFocused =
    document.activeElement === input ||
    document.activeElement?.tagName === "INPUT" ||
    document.activeElement?.tagName === "TEXTAREA";

  if (alreadyFocused) return;

  requestAnimationFrame(() => {
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
  });
};