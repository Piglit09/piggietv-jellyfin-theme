# =========================================================
# PIGGIETV THEME BUILD SCRIPT
# =========================================================

Write-Host "🔧 Building PiggieTV Theme..." -ForegroundColor Cyan

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

# =========================================================
# BUILD CSS
# =========================================================

$cssOrder = @(
    "base.css",
    "layout.css",
    "sidebar.css",
    "home.css",
    "dashboard.css",
    "login.css",
    "details\hero.css",
    "details\base.css",
    "details\series.css",
    "details\movies.css",
    "details\episodes.css",
    "responsive.css"
)

$cssOutput = "$distPath\custom.css"

Write-Host "📦 Building CSS..." -ForegroundColor Yellow

# Clear existing file
if (Test-Path $cssOutput) {
    Remove-Item $cssOutput
}

foreach ($file in $cssOrder) {
    $fullPath = Join-Path $cssPath $file

    if (Test-Path $fullPath) {
        Write-Host "  + $file"

        Add-Content $cssOutput "`n/* ===== $file ===== */`n"
        Get-Content $fullPath | Add-Content $cssOutput
    }
    else {
        Write-Host "  ⚠ Missing: $file" -ForegroundColor DarkYellow
    }
}

# =========================================================
# BUILD JS
# =========================================================

$jsInput = "$jsPath\custom.js"
$jsOutput = "$distPath\custom.js"

Write-Host "📦 Building JS..." -ForegroundColor Yellow

if (Test-Path $jsInput) {
    Copy-Item $jsInput $jsOutput -Force
    Write-Host "  + custom.js"
}
else {
    Write-Host "  ⚠ No custom.js found (skipped)" -ForegroundColor DarkYellow
}

# =========================================================
# DONE
# =========================================================

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host "👉 Output: dist/custom.css + dist/custom.js"