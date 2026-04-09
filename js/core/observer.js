window.PTV = window.PTV || {};

window.PTV.runAll = function () {
  window.PTV.runGlobalBranding();
  window.PTV.runLoginEnhancements();
  window.PTV.runHomeBackdropEnhancement();
};

window.PTV.observeApp = function () {
  if (!document.body || document.body.dataset.ptvObserverBound === "1") return;
  document.body.dataset.ptvObserverBound = "1";

  const observer = new MutationObserver((mutations) => {
    let shouldRunBranding = false;
    let shouldRunLogin = false;

    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const nodes = [
          ...mutation.addedNodes,
          ...mutation.removedNodes
        ];

        for (const node of nodes) {
          if (!(node instanceof HTMLElement)) continue;

          if (
            node.matches?.(".skinHeader, .mainDrawer, .navMenu, .drawerContent") ||
            node.querySelector?.(".skinHeader, .mainDrawer, .navMenu, .drawerContent")
          ) {
            shouldRunBranding = true;
          }

          if (
            node.matches?.("#loginPage, .manualLoginForm") ||
            node.querySelector?.("#loginPage, .manualLoginForm")
          ) {
            shouldRunLogin = true;
          }
        }
      }

      if (mutation.type === "attributes") {
        const el = mutation.target;
        if (!(el instanceof HTMLElement)) continue;

        if (
          el.matches(".skinHeader, .mainDrawer, .navMenu, .drawerContent") ||
          el.closest(".skinHeader, .mainDrawer")
        ) {
          shouldRunBranding = true;
        }

        if (
          el.matches("#loginPage, .manualLoginForm") ||
          el.closest("#loginPage")
        ) {
          shouldRunLogin = true;
        }
      }
    }

    if (shouldRunBranding) {
      window.PTV.schedule("branding", () => {
        window.PTV.runGlobalBranding();
      });
    }

    if (shouldRunLogin) {
      window.PTV.schedule("login", () => {
        window.PTV.runLoginEnhancements();
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"]
  });

  window.PTV.schedule("branding", () => {
    window.PTV.runGlobalBranding();
  });

  window.PTV.schedule("login", () => {
    window.PTV.runLoginEnhancements();
  });
};