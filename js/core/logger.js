window.PTV = window.PTV || {};

window.PTV.config = {
  LOG_PREFIX: "[PiggieTV]",
  LOGO_URL: "https://theme.piggietv.com/assets/logo/banner-light.png",
  DISCORD_URL: "https://discord.gg/FbtexGYau",
  SIGNUP_URL: "https://signup.piggietv.com/invite/ysBDoDSMpv5fFMz9GPMxUL"
};

window.PTV.log = function (...args) {
  console.log(window.PTV.config.LOG_PREFIX, ...args);
};