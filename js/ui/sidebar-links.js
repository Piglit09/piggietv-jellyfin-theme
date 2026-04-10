window.PTV = window.PTV || {};

window.PTV.sidebarLinks = {
  bound: false,
  items: [
    {
      id: "ptv-nav-request",
      label: "Request",
      href: "https://request.piggietv.com",
      iconUrl: "https://theme.piggietv.com/assets/icons/request.svg"
    },
    {
      id: "ptv-nav-games",
      label: "Games",
      href: "https://emu.piggietv.com",
      iconUrl: "https://theme.piggietv.com/assets/icons/games.svg"
    },
    {
      id: "ptv-nav-library",
      label: "Library",
      href: "https://books.piggietv.com",
      iconUrl: "https://theme.piggietv.com/assets/icons/library.svg"
    },
    {
      id: "ptv-nav-discord",
      label: "Discord",
      href: "https://discord.gg/FbtexGYau",
      iconUrl: "https://theme.piggietv.com/assets/icons/discord.svg"
    }
  ]
};

window.PTV.getSidebarNav = function () {
  return (
    document.querySelector(".mainDrawer .navMenu") ||
    document.querySelector(".mainDrawer .drawerContent") ||
    document.querySelector(".mainDrawer .itemsContainer") ||
    document.querySelector(".mainDrawer-scrollContainer")
  );
};

window.PTV.buildSidebarLink = function (item) {
  const link = document.createElement("a");
  link.id = item.id;
  link.className = "navMenuOption ptv-custom-sidebar-link";
  link.href = item.href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  const iconWrap = document.createElement("span");
  iconWrap.className = "navMenuOptionIcon ptv-custom-sidebar-icon";

  const img = document.createElement("img");
  img.src = item.iconUrl;
  img.className = "ptv-sidebar-icon-img";
  img.alt = "";

  iconWrap.appendChild(img);

  const text = document.createElement("span");
  text.className = "navMenuOptionText";
  text.textContent = item.label;

  link.appendChild(iconWrap);
  link.appendChild(text);

  return link;
};

window.PTV.injectSidebarLinks = function () {
  const nav = window.PTV.getSidebarNav();
  if (!nav) return false;

  let section = document.getElementById("ptv-sidebar-links");
  if (!section) {
    section = document.createElement("div");
    section.id = "ptv-sidebar-links";
    section.className = "ptv-sidebar-links";
  } else {
    section.replaceChildren();
  }

  for (const item of window.PTV.sidebarLinks.items) {
    section.appendChild(window.PTV.buildSidebarLink(item));
  }

  const existingSection = nav.querySelector("#ptv-sidebar-links");
  if (existingSection) existingSection.remove();

  const playlistsLink = Array.from(nav.querySelectorAll(".navMenuOption"))
    .find(el => /playlists/i.test(el.textContent || ""));

  const adminHeader = Array.from(
    nav.querySelectorAll(".navMenuHeader, .navMenuSectionTitle, .sectionTitle")
  ).find(el => /administration/i.test(el.textContent || ""));

  if (playlistsLink) {
    playlistsLink.insertAdjacentElement("afterend", section);
  } else if (adminHeader) {
    adminHeader.insertAdjacentElement("beforebegin", section);
  } else {
    nav.appendChild(section);
  }

  return true;
};

window.PTV.runSidebarEnhancements = function () {
  window.PTV.applySidebarLogo?.();
  window.PTV.injectSidebarLinks();
};