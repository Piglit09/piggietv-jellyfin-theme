[CmdletBinding()]
param(
    [switch]$NoVersionBump
)

$ErrorActionPreference = "Stop"

# Repo root = parent of /scripts
$RepoRoot = Split-Path -Parent $PSScriptRoot
$CssDir   = Join-Path $RepoRoot "css"
$JsDir    = Join-Path $RepoRoot "js"
$DistDir  = Join-Path $RepoRoot "dist"

$OutputCss = Join-Path $DistDir "PiggieTV.css"
$OutputJs  = Join-Path $DistDir "PiggieTV.js"
$VersionJson = Join-Path $DistDir "version.json"

function Ensure-Dir {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
    }
}

function Read-Utf8NoBom {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        throw "Missing file: $Path"
    }
    return [System.IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
}

function Write-Utf8NoBom {
    param(
        [string]$Path,
        [string]$Content
    )
    $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $Utf8NoBom)
}

function Get-VersionValue {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return "2.0.0"
    }

    try {
        $json = Get-Content $Path -Raw | ConvertFrom-Json
        if ($json.version) {
            return [string]$json.version
        }
    } catch {
        Write-Warning "version.json exists but could not be parsed. Resetting to 2.0.0"
    }

    return "2.0.0"
}

function Increment-Version {
    param([string]$Version)

    $parts = $Version.Split(".")
    if ($parts.Count -lt 3) {
        return "2.0.0"
    }

    $major = [int]$parts[0]
    $minor = [int]$parts[1]
    $patch = [int]$parts[2]

    $patch++
    return "$major.$minor.$patch"
}

Ensure-Dir $DistDir

# Build order matters
$CssFiles = @(
    "base.css",
    "layout.css",
    "header.css",
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
    "details\episodes.css";

) | ForEach-Object { Join-Path $CssDir $_ }

$JsFiles = @(
    "branding\header-logo.js",
    "ui\header-icons.js",
    "ui\playback-icons.js",
    "login\login-actions.js",
    "login\login-effects.js",
    "ui\sidebar-links.js",
    "ui\home-backdrop.js";

) | ForEach-Object { Join-Path $JsDir $_ }

# Validate all inputs before writing outputs
$Missing = @()

foreach ($file in $CssFiles + $JsFiles) {
    if (-not (Test-Path $file)) {
        $Missing += $file
    }
}

if ($Missing.Count -gt 0) {
    Write-Error ("Build aborted. Missing source files:`n - " + ($Missing -join "`n - "))
    exit 1
}

# Build CSS
$CssBuilder = New-Object System.Text.StringBuilder
[void]$CssBuilder.AppendLine("/* AUTO-BUILT FILE - DO NOT EDIT */")
[void]$CssBuilder.AppendLine("")

foreach ($file in $CssFiles) {
    $name = Split-Path $file -Leaf
    [void]$CssBuilder.AppendLine("/* ===== $name ===== */")
    [void]$CssBuilder.AppendLine((Read-Utf8NoBom $file).TrimEnd())
    [void]$CssBuilder.AppendLine("")
}

Write-Utf8NoBom -Path $OutputCss -Content $CssBuilder.ToString()

# Build JS
$JsBuilder = New-Object System.Text.StringBuilder
[void]$JsBuilder.AppendLine("/* AUTO-BUILT FILE - DO NOT EDIT */")
[void]$JsBuilder.AppendLine("")

foreach ($file in $JsFiles) {
    $relative = $file.Substring($RepoRoot.Length).TrimStart('\')
    [void]$JsBuilder.AppendLine("/* ===== $relative ===== */")
    [void]$JsBuilder.AppendLine((Read-Utf8NoBom $file).TrimEnd())
    [void]$JsBuilder.AppendLine("")
}

Write-Utf8NoBom -Path $OutputJs -Content $JsBuilder.ToString()

# Version bump
$currentVersion = Get-VersionValue $VersionJson
$newVersion = if ($NoVersionBump) { $currentVersion } else { Increment-Version $currentVersion }

$versionObj = @{
    version   = $newVersion
    builtAt   = (Get-Date).ToString("o")
} | ConvertTo-Json

Write-Utf8NoBom -Path $VersionJson -Content ($versionObj + "`n")

Write-Host "CSS build complete: $OutputCss" -ForegroundColor Green
Write-Host "JS build complete:  $OutputJs" -ForegroundColor Green
Write-Host "Version:            $newVersion" -ForegroundColor Cyan