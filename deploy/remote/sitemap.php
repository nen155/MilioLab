<?php
/**
 * MilioLab · sitemap.xml
 *
 * La web es estática y la API vive en /api. Este pequeño puente arranca la API
 * con la ruta del sitemap para poder servirlo en la raíz del dominio.
 */

$_SERVER['REQUEST_URI'] = '/api/sitemap';
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__.'/api/index.php';

require __DIR__.'/api/index.php';
