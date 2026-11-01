<?php
/**
 * MilioLab · migraciones y cachés en el hosting compartido (sin SSH).
 *
 * Arranca Laravel desde la aplicación y ejecuta los comandos con el kernel de
 * consola: no hace falta `php` en la línea de comandos.
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

header('Content-Type: text/plain; charset=utf-8');
echo "== MilioLab · deploy ==\n";
echo 'PHP: '.PHP_VERSION."\n";
echo "App: {$appPath}\n";

foreach (['pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json', 'fileinfo', 'gd', 'zip'] as $extension) {
    echo str_pad("ext {$extension}", 16).(extension_loaded($extension) ? 'OK' : 'FALTA')."\n";
}

echo 'vendor: '.(is_dir($appPath.'/vendor') ? 'OK' : 'FALTA')."\n";
echo '.env: '.(is_file($appPath.'/.env') ? 'OK' : 'FALTA')."\n\n";

require $appPath.'/vendor/autoload.php';

$app = require $appPath.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$run = function (string $command, array $params = []) use ($kernel): void {
    try {
        $code = $kernel->call($command, $params);
        echo "> {$command} (exit {$code})\n".$kernel->output()."\n";
    } catch (Throwable $exception) {
        echo "> {$command} ERROR: ".$exception->getMessage()."\n\n";
    }
};

if (($_GET['key'] ?? '') === '1' || empty(config('app.key'))) {
    $run('key:generate', ['--force' => true]);
}

$run('migrate', ['--force' => true]);

if (($_GET['seed'] ?? '') === '1') {
    $run('db:seed', ['--force' => true]);
}

$run('config:cache');
$run('route:cache');
$run('view:cache');

// Permisos de las carpetas que escribe Laravel.
foreach (['storage', 'storage/app', 'storage/framework', 'storage/framework/cache', 'storage/framework/sessions', 'storage/framework/views', 'storage/logs', 'bootstrap/cache', 'public/media'] as $dir) {
    $path = $appPath.'/'.$dir;

    if (is_dir($path)) {
        @chmod($path, 0775);
    }
}

echo "\nListo. Borra deploy.php del servidor.\n";
