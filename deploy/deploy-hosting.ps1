<#
.SYNOPSIS
    Despliega MilioLab al hosting compartido (IONOS) con WinSCP, sin SSH.

.DESCRIPTION
    Lee las credenciales de `deploy/deploy.env` (gitignored). Pasos:

    1. (Opcional) compila los artefactos con `deploy/build.ps1`.
    2. Sube `api.zip` a la app Laravel y lo extrae con `unzip-deploy.php`.
    3. Ejecuta `deploy.php` (migraciones + cachés).
    4. Sincroniza la web pública y el panel.
    5. Sube el `index.php` de la API y su `.htaccess`.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File deploy/deploy-hosting.ps1 -Build
    powershell -ExecutionPolicy Bypass -File deploy/deploy-hosting.ps1 -Build -Seed
#>
[CmdletBinding()]
param(
    [switch]$Build,
    [switch]$Seed,
    [switch]$Env,
    [string]$EnvFile = ""
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
if (-not $EnvFile) { $EnvFile = Join-Path $PSScriptRoot "deploy.env" }

$winscpCandidates = @(
    (Join-Path $repoRoot "tools/winscp/WinSCP.com"),
    "WinSCP.com"
)
$winscp = $winscpCandidates | Where-Object { $_ -eq "WinSCP.com" -or (Test-Path $_) } | Select-Object -First 1
if (-not $winscp) {
    throw "No encuentro WinSCP. Descarga la versión portable en tools/winscp o instálalo en el PATH."
}

if (-not (Test-Path $EnvFile)) {
    throw "Falta $EnvFile. Copia deploy/deploy.env.example a deploy/deploy.env y rellénalo."
}

$cfg = @{}
Get-Content $EnvFile | Where-Object { $_ -match '^\s*[^#\s]' -and $_ -match '=' } | ForEach-Object {
    $key, $value = $_ -split '=', 2
    $cfg[$key.Trim()] = $value.Trim()
}

foreach ($key in 'DEPLOY_HOST', 'DEPLOY_USER', 'DEPLOY_PASSWORD', 'DEPLOY_WEB_DIR', 'DEPLOY_PANEL_DIR', 'DEPLOY_API_PUBLIC_DIR', 'DEPLOY_API_APP_DIR', 'DEPLOY_API_URL', 'DEPLOY_TOKEN') {
    if (-not $cfg[$key]) { throw "Falta $key en $EnvFile" }
}

$port = if ($cfg['DEPLOY_PORT']) { $cfg['DEPLOY_PORT'] } else { '22' }
$protocol = if ($cfg['DEPLOY_PROTOCOL']) { $cfg['DEPLOY_PROTOCOL'] } else { 'sftp' }

$webDir = $cfg['DEPLOY_WEB_DIR'].TrimEnd('/')
$panelDir = $cfg['DEPLOY_PANEL_DIR'].TrimEnd('/')
$apiPublicDir = $cfg['DEPLOY_API_PUBLIC_DIR'].TrimEnd('/')
$apiAppDir = $cfg['DEPLOY_API_APP_DIR'].TrimEnd('/')
$apiUrl = $cfg['DEPLOY_API_URL'].TrimEnd('/')
$token = $cfg['DEPLOY_TOKEN']

$out = Join-Path $PSScriptRoot "out"
if ($Build -or -not (Test-Path (Join-Path $out "api.zip"))) {
    & (Join-Path $PSScriptRoot "build.ps1")
}

# Ruta relativa de la carpeta pública de la API a la app Laravel.
function Get-RelativePath([string]$from, [string]$to) {
    $fromParts = $from.Trim('/').Split('/')
    $toParts = $to.Trim('/').Split('/')
    $common = 0
    while ($common -lt $fromParts.Count -and $common -lt $toParts.Count -and $fromParts[$common] -eq $toParts[$common]) {
        $common++
    }
    $up = $fromParts.Count - $common
    $down = ($toParts[$common..($toParts.Count - 1)] -join '/')
    return (("../" * $up) + $down).TrimEnd('/')
}

$relativeApp = Get-RelativePath $apiPublicDir $apiAppDir
$appPathPhp = "__DIR__.'/$relativeApp'"

function New-RemoteFile([string]$template, [string]$target) {
    $content = Get-Content $template -Raw
    $content = $content.Replace('__APP_PATH__', $appPathPhp).Replace('__DEPLOY_TOKEN__', $token)
    # Sin BOM: un BOM antes de <?php rompe las cabeceras HTTP.
    [System.IO.File]::WriteAllText($target, $content, (New-Object System.Text.UTF8Encoding($false)))
}

$tmp = Join-Path $env:TEMP ("miliolab-deploy-" + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $tmp | Out-Null

New-RemoteFile (Join-Path $PSScriptRoot "remote/index.php") (Join-Path $tmp "index.php")
New-RemoteFile (Join-Path $PSScriptRoot "remote/unzip-deploy.php") (Join-Path $tmp "unzip-deploy.php")
New-RemoteFile (Join-Path $PSScriptRoot "remote/deploy.php") (Join-Path $tmp "deploy.php")

# `.env` de producción generado desde deploy.env (no se versiona).
if ($Env) {
    $template = Get-Content (Join-Path $PSScriptRoot "api.env.template") -Raw
    $values = @{
        '__APP_KEY__'         = $cfg['DEPLOY_APP_KEY']
        '__SITE_URL__'        = $cfg['DEPLOY_SITE_URL']
        '__DB_HOST__'         = $cfg['DEPLOY_DB_HOST']
        '__DB_PORT__'         = $cfg['DEPLOY_DB_PORT']
        '__DB_DATABASE__'     = $cfg['DEPLOY_DB_DATABASE']
        '__DB_USERNAME__'     = $cfg['DEPLOY_DB_USERNAME']
        '__DB_PASSWORD__'     = $cfg['DEPLOY_DB_PASSWORD']
        '__MEDIA_ROOT__'      = "$apiPublicDir/media"
        '__ADMIN_NAME__'      = $cfg['DEPLOY_ADMIN_NAME']
        '__ADMIN_EMAIL__'     = $cfg['DEPLOY_ADMIN_EMAIL']
        '__ADMIN_PASSWORD__'  = $cfg['DEPLOY_ADMIN_PASSWORD']
    }

    foreach ($key in $values.Keys) {
        $template = $template.Replace($key, [string]$values[$key])
    }

    Set-Content -Path (Join-Path $tmp "api.env") -Value $template -Encoding UTF8 -NoNewline
    # El .env también sin BOM.
    $envPath = Join-Path $tmp "api.env"
    [System.IO.File]::WriteAllText($envPath, $template, (New-Object System.Text.UTF8Encoding($false)))
}

$session = "${protocol}://" + [uri]::EscapeDataString($cfg['DEPLOY_USER']) + ":" +
    [uri]::EscapeDataString($cfg['DEPLOY_PASSWORD']) + "@" + $cfg['DEPLOY_HOST'] + ":$port/"

function Invoke-WinScp([string[]]$lines, [string]$step, [switch]$ContinueOnError) {
    $script = Join-Path $tmp ("winscp-" + [guid]::NewGuid().ToString('N') + ".txt")
    $log = Join-Path $tmp ("winscp-" + [guid]::NewGuid().ToString('N') + ".log")

    $batch = if ($ContinueOnError) { "continue" } else { "abort" }

    $header = @(
        "option batch $batch",
        "option confirm off",
        "open `"$session`" -hostkey=`"*`""
    )

    Set-Content -Path $script -Value ($header + $lines + @("exit")) -Encoding ASCII

    Write-Host "> $step" -ForegroundColor Yellow
    & $winscp /script=$script /log=$log /loglevel=0
    if ($LASTEXITCODE -ne 0 -and -not $ContinueOnError) {
        Write-Host "WinSCP ha fallado (código $LASTEXITCODE). Log: $log" -ForegroundColor Red
        throw "Fallo en el paso: $step"
    }
}

try {
    # 0) Carpetas remotas (si ya existen, mkdir falla y se ignora)
    Invoke-WinScp @(
        "mkdir `"$apiAppDir`"",
        "mkdir `"$apiPublicDir`"",
        "mkdir `"$panelDir`"",
        "mkdir `"$apiPublicDir/media`""
    ) "Creando carpetas" -ContinueOnError

    # 1) API: subir zip + extractor y ejecutarlo
    $uploadLines = @(
        "put `"$(Join-Path $out 'api.zip')`" `"$apiAppDir/_deploy.zip`"",
        "put `"$(Join-Path $tmp 'unzip-deploy.php')`" `"$apiPublicDir/unzip-deploy.php`""
    )

    if ($Env) {
        $uploadLines = @("put `"$(Join-Path $tmp 'api.env')`" `"$apiAppDir/.env`"") + $uploadLines
    }

    Invoke-WinScp $uploadLines "Subiendo la API"

    Write-Host "> Extrayendo la API" -ForegroundColor Yellow
    $unzipUrl = "$apiUrl/unzip-deploy.php?token=" + [uri]::EscapeDataString($token)
    (Invoke-WebRequest -Uri $unzipUrl -UseBasicParsing -TimeoutSec 300).Content

    # 2) Migraciones + cachés
    Invoke-WinScp @(
        "put `"$(Join-Path $tmp 'deploy.php')`" `"$apiPublicDir/deploy.php`""
    ) "Subiendo el script de despliegue"

    Write-Host "> Migrando la base de datos" -ForegroundColor Yellow
    $deployUrl = "$apiUrl/deploy.php?token=" + [uri]::EscapeDataString($token)
    if ($Seed) { $deployUrl += "&seed=1" }
    (Invoke-WebRequest -Uri $deployUrl -UseBasicParsing -TimeoutSec 300).Content

    # 3) index.php + .htaccess de la API y carpeta de medios
    Invoke-WinScp @(
        "put `"$(Join-Path $tmp 'index.php')`" `"$apiPublicDir/index.php`"",
        "put `"$(Join-Path $repoRoot 'apps/api/public/.htaccess')`" `"$apiPublicDir/.htaccess`"",
        "put `"$(Join-Path $PSScriptRoot 'api-app/.htaccess')`" `"$apiAppDir/.htaccess`"",
        "chmod 775 `"$apiPublicDir/media`"",
        "rm `"$apiPublicDir/unzip-deploy.php`"",
        "rm `"$apiPublicDir/deploy.php`""
    ) "Publicando la API" -ContinueOnError

    # 4) Web pública y panel
    Invoke-WinScp @(
        "synchronize remote `"$(Join-Path $out 'web')`" `"$webDir`""
    ) "Subiendo la web"

    Invoke-WinScp @(
        "synchronize remote `"$(Join-Path $out 'panel')`" `"$panelDir`" -delete"
    ) "Subiendo el panel"

    Write-Host ""
    Write-Host "Despliegue completado." -ForegroundColor Green
    Write-Host "  Web:   $($cfg['DEPLOY_SITE_URL'])"
    Write-Host "  Panel: $($cfg['DEPLOY_SITE_URL'])/milio/"
    Write-Host "  API:   $apiUrl"
}
finally {
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
