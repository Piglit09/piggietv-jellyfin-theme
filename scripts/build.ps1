# PIGGIETV THEME BUILD SCRIPT

Write-Host "Building PiggieTV Theme..." -ForegroundColor Cyan

# Paths
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path "$root\.."

$cssPath = "$projectRoot\css"
$jsPath = "$projectRoot\js"
$distPath = "$projectRoot\dist"

# Ensure dist folder exists
if (!(Test-Path $distPath)) {
    New-Item -ItemType Directory -Path $distPath | Out-Null
}

# Build CSS
$cssOrder = @(
    "base.css",
    "layout.css",
    "sidebar.css",
    "home.css",
    "dashboard.css",
    "settings.css",
    "login.css",
    "playback.css",
    "details\hero.css",
    "details\base.css",
    "details\series.css",
    "details\movies.css",
    "details\episodes.css",
    "responsive.css"
)

$cssOutput = "$distPath\custom.css"

Write-Host "Building CSS..." -ForegroundColor Yellow

if (Test-Path $cssOutput) {
    Remove-Item $cssOutput
}

foreach ($file in $cssOrder) {
    $fullPath = Join-Path $cssPath $file

    if (Test-Path $fullPath) {
        Write-Host ("  + " + $file)
        Add-Content -Path $cssOutput -Value ""
        Add-Content -Path $cssOutput -Value ("/* ===== " + $file + " ===== */")
        Get-Content $fullPath | Add-Content $cssOutput
    }
    else {
        Write-Host ("  Missing: " + $file) -ForegroundColor DarkYellow
    }
}

# Build JS
$jsSourcePath = "$projectRoot\js"
$jsOutput = "$distPath\custom.js"

$jsFiles = @(
    "core\logger.js",
    "core\helpers.js",
    "branding\header-logo.js",
    "branding\sidebar-logo.js",
    "login\login-header.js",
    "login\login-actions.js",
    "login\login-focus.js",
    "login\login-effects.js",
    "ui\background-glow.js",
    "ui\sidebar-links.js",
    "ui\home-backdrop.js",
    "core\observer.js",
    "core\init.js"
)

Write-Host "Building JS..." -ForegroundColor Yellow

if (Test-Path $jsOutput) {
    Remove-Item $jsOutput
}

"/* AUTO-BUILT FILE - DO NOT EDIT */`n" | Set-Content $jsOutput

$missingJs = @()

foreach ($file in $jsFiles) {
    $fullPath = Join-Path $jsSourcePath $file

    if (Test-Path $fullPath) {
        Write-Host ("  + " + $file)
        Add-Content -Path $jsOutput -Value ""
        Add-Content -Path $jsOutput -Value ("/* ===== " + $file + " ===== */")
        Get-Content $fullPath | Add-Content $jsOutput
    }
    else {
        Write-Host ("  Missing: " + $file) -ForegroundColor DarkYellow
        $missingJs += $file
    }
}

if ($missingJs.Count -gt 0) {
    Write-Host ""
    Write-Host "JS build finished with missing files." -ForegroundColor Red
    $missingJs | ForEach-Object { Write-Host ("  - " + $_) -ForegroundColor Red }
    exit 1
}
else {
    Write-Host "[OK] JS build complete" -ForegroundColor Green
}