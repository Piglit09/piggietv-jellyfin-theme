window.PTV = window.PTV || {};

window.PTV.injectLoginHeader = function () {
  const form = window.PTV.getLoginForm();
  if (!form || document.getElementById("ptv-login-header")) return;

  const header = document.createElement("div");
  header.id = "ptv-login-header";
  header.innerHTML = `
    <img src="${window.PTV.config.LOGO_URL}" class="ptv-login-logo" alt="PiggieTV">
    <div class="ptv-login-tagline">MOVIES • TV SHOWS • ANIME</div>
  `;

  form.prepend(header);
  window.PTV.log("login header injected");
};