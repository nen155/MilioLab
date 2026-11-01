<?php
/**
 * MilioLab · extrae _deploy.zip sobre la aplicación Laravel.
 *
 * Se sube junto al zip y se ejecuta una vez por HTTP (el hosting no tiene SSH).
 * Omite .env, storage/ y los propios scripts de despliegue.
 */

$token = '__DEPLOY_TOKEN__';

if (! hash_equals($token, (string) ($_GET['token'] ?? ''))) {
    http_response_code(403);
    exit('Forbidden');
}

ini_set('display_errors', '1');
error_reporting(E_ALL);
set_time_limit(300);

$appPath = __APP_PATH__;
$zipFile = $appPath.'/_deploy.zip';

header('Content-Type: text/plain; charset=utf-8');
echo "== MilioLab · unzip-deploy ==\n";
echo "Zip: {$zipFile}\n";
echo "Destino: {$appPath}\n\n";

if (! is_file($zipFile)) {
    exit("ERROR: no existe {$zipFile}.\n");
}

$skipExact = ['.env', '_deploy.zip', 'unzip-deploy.php', 'deploy.php'];
$skipDirs = ['storage/'];

$zip = new ZipArchive();

if ($zip->open($zipFile) !== true) {
    exit("ERROR: no se puede abrir el zip.\n");
}

$prefix = 'api/';
$ok = 0;
$skipped = 0;
$errors = 0;

for ($i = 0; $i < $zip->numFiles; $i++) {
    // Windows puede guardar las rutas con "\": se normalizan.
    $name = str_replace('\\', '/', (string) $zip->getNameIndex($i));

    if (substr($name, -1) === '/' || $name === '') {
        continue;
    }

    // Según cómo se comprimió, el zip puede llevar la carpeta raíz o no.
    $relative = str_starts_with($name, $prefix) ? substr($name, strlen($prefix)) : $name;

    if ($relative === '') {
        continue;
    }

    if (in_array($relative, $skipExact, true)) {
        $skipped++;
        continue;
    }

    foreach ($skipDirs as $dir) {
        if (str_starts_with($relative, $dir)) {
            $skipped++;
            continue 2;
        }
    }

    $target = $appPath.'/'.$relative;

    if (! is_dir(dirname($target))) {
        @mkdir(dirname($target), 0755, true);
    }

    $content = $zip->getFromIndex($i);

    if ($content === false || file_put_contents($target, $content) === false) {
        $errors++;
        echo "ERROR: {$relative}\n";
    } else {
        $ok++;
    }
}

$zip->close();
@unlink($zipFile);

echo "\nExtraídos: {$ok} · omitidos: {$skipped} · errores: {$errors}\n";
