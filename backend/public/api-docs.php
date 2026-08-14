<?php
declare(strict_types=1);

/**
 * Serve the OpenAPI spec as JSON.
 *
 * Access at: /api/docs/openapi.json
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=3600');

$specFile = __DIR__ . '/../docs/openapi.json';

if (!file_exists($specFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'OpenAPI spec not found']);
    exit;
}

echo file_get_contents($specFile);
