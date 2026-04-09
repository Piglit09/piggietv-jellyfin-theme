window.PTV = window.PTV || {};

window.PTV.injectLoginButtons = function () {
  const form = window.PTV.getLoginForm();
  const submitBtn = window.PTV.getSubmitButton();

  if (!form || !submitBtn || document.getElementById("ptv-login-actions")) return;

  const quickBtn = document.querySelector("#loginPage .btnQuick");
  const forgotBtn = document.querySelector("#loginPage .btnForgotPassword");

  const actions = document.createElement("div");
  actions.id = "ptv-login-actions";
  actions.innerHTML = `
    <button type="button" class="emby-button block ptv-login-action ptv-secondary" data-ptv-action="signup">
      Sign Up
    </button>
    <button type="button" class="emby-button block ptv-login-action ptv-secondary" data-ptv-action="forgot">
      Forgot Password
    </button>
    <button type="button" class="emby-button block ptv-login-action ptv-secondary" data-ptv-action="quick">
      Use Quick Connect
    </button>
    <a class="emby-button block ptv-login-action ptv-discord"
       data-ptv-action="discord"
       href="${window.PTV.config.DISCORD_URL}"
       target="_blank"
       rel="noopener noreferrer">
      Discord
    </a>
  `;

  submitBtn.insertAdjacentElement("afterend", actions);

  actions.addEventListener("click", (event) => {
    const target = event.target.closest("[data-ptv-action]");
    if (!target) return;

    const action = target.getAttribute("data-ptv-action");

    if (action === "signup") {
      window.open(window.PTV.config.SIGNUP_URL, "_self");
      return;
    }

    if (action === "forgot") {
      if (forgotBtn) forgotBtn.click();
      return;
    }

    if (action === "quick") {
      if (quickBtn) quickBtn.click();
    }
  });

  window.PTV.log("login buttons injected");
};