<?php

declare(strict_types=1);

/**
 * BookBay API front controller.
 *
 * Run locally:
 *   php -S 127.0.0.1:8000 -t public public/index.php
 *
 * Deploy: point the web root at public/ (the only directory that
 * should be web-accessible).
 */

use BookBay\Core\Config;
use BookBay\Core\Request;
use BookBay\Core\Response;
use BookBay\Core\Router;

require __DIR__ . '/../autoload.php';

Config::load(__DIR__ . '/../.env');

// CORS preflight.
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    Response::options();
}

$router = new Router();

require __DIR__ . '/../routes/api.php';

$request = Request::capture();
$result = $router->dispatch($request->method(), $request->path());

if ($result === null) {
    Response::json(['message' => 'Not Found.'], 404);
}

// Handlers that return a value instead of echoing get serialized here.
Response::json($result);
