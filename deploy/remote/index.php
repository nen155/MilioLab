<?php
/**
 * MilioLab · entrada pública de la API.
 *
 * Este archivo se sube a la carpeta `api/` del dominio. La aplicación Laravel
 * vive fuera del docroot (p. ej. /htdocs/miliolab-api), así que se referencia
 * con una ruta relativa que el script de despliegue rellena.
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$app = __APP_PATH__;

if (file_exists($maintenance = $app.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

// La API se sirve en /api: se le dice a Symfony que la raíz es el dominio,
// para que el prefijo `api` de las rutas case con la URL real.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__.'/index.php';

require $app.'/vendor/autoload.php';

(require_once $app.'/bootstrap/app.php')->handleRequest(Request::capture());
