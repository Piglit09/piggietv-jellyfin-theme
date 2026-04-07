# 🐷 PiggieTV Jellyfin Theme

A fully customized Jellyfin frontend for **PiggieTV**, featuring branding, dynamic UI behavior, and auto-updating deployment.

---

## ✨ Features

- 🎨 Branded login screen
- 🧭 Custom sidebar (logo + apps)
- 🔗 External app links (Request, Games, Library, Discord)
- 🌈 Glow + hover effects
- 🎬 Dynamic backdrops:
  - hover-based switching
  - idle slideshow (Netflix-style)
- 🧠 Smart glow coloring based on content
- 🌐 Custom browser tab icon
- ⚡ Auto-updating theme (no manual versioning)

---

## 🔧 Prerequisites (REQUIRED)

Install these plugins before using the theme:

### JavaScript Injector
Loads PiggieTV custom frontend logic.

https://github.com/n00bcodr/Jellyfin-JavaScript-Injector

---

### File Transformation
Enables deeper UI customization beyond CSS.

https://github.com/IAmParadox27/jellyfin-plugin-file-transformation

---

### After installing:
- Restart Jellyfin
- Hard refresh browser (`Ctrl + Shift + R`)

---

## 📁 Structure

- `css/` source styles
- `js/` theme logic
- `assets/` icons, logos, backgrounds
- `dist/` production build (served to Jellyfin)
- `scripts/` build and deploy helpers

---

## 🌐 Production URLs

Theme is served externally:

- https://theme.piggietv.com/dist/custom.css
- https://theme.piggietv.com/dist/custom.js
- https://theme.piggietv.com/dist/version.json

---

## ⚙️ Installation

### 1. Add Custom CSS

Jellyfin Dashboard → **General → Custom CSS**

```css
@import url("https://theme.piggietv.com/dist/custom.css");
```
---

### 2. Setup JavaScript Injector (AUTO-UPDATING)

⚠️ Do NOT paste your full JS  
⚠️ Do NOT manually update versions  

Paste this instead:

```javascript
(function () {
  const BASE = "https://theme.piggietv.com/dist";

  function addCss(version) {
    if (document.querySelector("link[data-ptv-theme-css]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = BASE + "/custom.css?v=" + encodeURIComponent(version);
    link.setAttribute("data-ptv-theme-css", "1");
    document.head.appendChild(link);
  }

  function addJs(version) {
    if (document.querySelector("script[data-ptv-theme-js]")) return;
    const script = document.createElement("script");
    script.src = BASE + "/custom.js?v=" + encodeURIComponent(version);
    script.defer = true;
    script.setAttribute("data-ptv-theme-js", "1");
    document.head.appendChild(script);
  }

  function load(version) {
    addCss(version);
    addJs(version);
  }

  fetch(BASE + "/version.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) throw new Error("version.json " + res.status);
      return res.json();
    })
    .then(function (data) {
      const version = (data && data.version ? String(data.version).trim() : "");
      load(version || String(Date.now()));
    })
    .catch(function () {
      load(String(Date.now()));
    });
})();
```
---

## 🚀 How Updates Work

Theme updates are controlled via:

Example:

```json
{
  "version": "1.0.7"
}
```
## 🧪 Troubleshooting

Theme not updating
  - Hard refresh (Ctrl + Shift + R)
  - Verify version.json loads
  - Check JavaScript Injector is enabled

Sidebar not opening
  - Check browser console (F12)
  - Usually caused by JS error or bad asset URL
    
Backdrop not switching
  - JS not running OR CSS conflict
  - Check .ptv-backdrop-layer exists

Icons not showing

 Common mistake:
  - ❌ theme.piggie.com/assests/
  - ✅ theme.piggietv.com/assets/
 
 ---
## ⚠️ Notes
I host all all my own assets (Nginx/CDN recommended)
```css
https://theme.piggietv.com/assets/
```
 - This is not just CSS — it modifies Jellyfin frontend behavior
 - Best used with Chromium browsers

## 🧠 Architecture

This theme is a:

 -- Versioned, externally managed frontend layer for Jellyfin

- CSS → styling
- JS → behavior
 - version.json → update control
## 🔥 Future Plans

 - Theme settings UI
 - Per-user customization
 - Additional animations
 - Dynamic content-based UI enhancements
