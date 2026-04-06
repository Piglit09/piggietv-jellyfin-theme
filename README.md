# PiggieTV Jellyfin Theme

Custom Jellyfin theme for PiggieTV, including:

- branded login screen
- custom sidebar logo
- custom tabs / navigation
- glow and hover effects
- themed home/detail/settings pages
- external assets hosted on PiggieTV

## Structure

- `css/` source CSS files by section
- `js/` custom JavaScript
- `assets/` logos, icons, backgrounds
- `dist/` built deployable files
- `scripts/` build and deploy helpers

## Production URLs

Theme files are served from:

- `https://piggietv.com/theme/custom.css`
- `https://piggietv.com/theme/custom.js`

## Jellyfin configuration

### Custom CSS
```css
@import url("https://piggietv.com/theme/custom.css");
