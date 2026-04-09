window.PTV = window.PTV || {};

window.PTV.setBodyReadyFlag = function () {
  if (!document.body) return;
  document.body.classList.add("ptv-loaded");
};

window.PTV.getLoginForm = function () {
  return document.querySelector("#loginPage .manualLoginForm");
};

window.PTV.getSubmitButton = function () {
  const form = window.PTV.getLoginForm();
  if (!form) return null;

  return (
    form.querySelector('button[type="submit"]') ||
    form.querySelector(".button-submit") ||
    form.querySelector(".emby-button.submit") ||
    form.querySelector(".emby-button.button-submit")
  );
};

window.PTV.getUsernameInput = function () {
  const form = window.PTV.getLoginForm();
  if (!form) return null;

  return (
    form.querySelector('input[type="text"]') ||
    form.querySelector('input[name="username"]') ||
    form.querySelector(".emby-input")
  );
};

window.PTV._rafQueue = window.PTV._rafQueue || {};

window.PTV.schedule = function (key, fn) {
  if (window.PTV._rafQueue[key]) return;

  window.PTV._rafQueue[key] = true;

  requestAnimationFrame(() => {
    window.PTV._rafQueue[key] = false;
    fn();
  });
};