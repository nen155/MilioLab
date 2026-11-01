<#
.SYNOPSIS
    Construye los artefactos de despliegue de MilioLab en `deploy/out`.

.DESCRIPTION
    - Compila la web pública y el panel (Angular) en modo producción.
    - Prepara la carpeta del API con vendor/ y la comprime en `api.zip`.
    - Añade los `.htaccess` de cada sitio.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File deploy/build.ps1
    powershell -ExecutionPolicy Bypass -File deploy/build.ps1 -SkipFrontend
#>
[CmdletBinding()]
param(
    [switch]$SkipFrontend
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $PSScriptRoot "out"

Write-Host "== MilioLab · build ==" -ForegroundColor Cyan

if (-not $SkipFrontend) {
    Write-Host "> Web pública (Angular)" -ForegroundColor Yellow
    Push-Location (Join-Path $root "apps/web")
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Fallo al compilar la web." }
    Pop-Location

    Write-Host "> Panel (Angular, base /milio/)" -ForegroundColor Yellow
    Push-Location (Join-Path $root "apps/panel")
    npm run build:prod
    if ($LASTEXITCODE -ne 0) { throw "Fallo al compilar el panel." }
    Pop-Location
}

if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Path $out | Out-Null

Write-Host "> Copiando artefactos" -ForegroundColor Yellow

$webOut = Join-Path $out "web"
$panelOut = Join-Path $out "panel"
New-Item -ItemType Directory -Path $webOut, $panelOut | Out-Null

Copy-Item (Join-Path $root "apps/web/dist/web/browser/*") $webOut -Recurse -Force
Copy-Item (Join-Path $PSScriptRoot "web/.htaccess") (Join-Path $webOut ".htaccess") -Force

Copy-Item (Join-Path $root "apps/panel/dist/panel/browser/*") $panelOut -Recurse -Force
Copy-Item (Join-Path $PSScriptRoot "panel/.htaccess") (Join-Path $panelOut ".htaccess") -Force

# --- API ---------------------------------------------------------------------
$apiTmp = Join-Path $out "api"
New-Item -ItemType Directory -Path $apiTmp | Out-Null

$include = @(
    "app", "bootstrap", "config", "database", "public", "resources", "routes",
    "storage", "vendor", "artisan", "composer.json", "composer.lock"
)

foreach ($item in $include) {
    $source = Join-Path $root "apps/api/$item"
    if (Test-Path $source) {
        Copy-Item $source (Join-Path $apiTmp $item) -Recurse -Force
    }
}

# Carpetas de escritura vacías (se recrean en el servidor).
foreach ($dir in @("storage/logs", "storage/framework/cache/data", "storage/framework/sessions", "storage/framework/views", "bootstrap/cache")) {
    $path = Join-Path $apiTmp $dir
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    Get-ChildItem $path -Force -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne ".gitignore" } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

# Nada de .env ni de logs locales.
Remove-Item (Join-Path $apiTmp ".env") -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $apiTmp "storage/logs/*.log") -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $apiTmp "storage/app/purifier") -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "> Comprimiendo API" -ForegroundColor Yellow
Compress-Archive -Path $apiTmp -DestinationPath (Join-Path $out "api.zip") -Force
Remove-Item $apiTmp -Recurse -Force

Write-Host ""
Write-Host "Listo: $out" -ForegroundColor Green
Write-Host "  web/     → $($webOut)"
Write-Host "  panel/   → $($panelOut)"
Write-Host "  api.zip  → aplicación Laravel"
