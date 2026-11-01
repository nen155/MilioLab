<?php
/**
 * MilioLab · feed.xml
 *
 * Puente equivalente al del sitemap: arranca la API con la ruta del RSS.
 */

$_SERVER['REQUEST_URI'] = '/api/feed';
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__.'/api/index.php';

require __DIR__.'/api/index.php';
