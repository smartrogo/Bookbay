<?php

declare(strict_types=1);

namespace Bookbay\Core;

final class Response
{
    /**
     * Test hook: when set, terminate() invokes it instead of exiting so
     * unit tests can inspect the response. Never set in production.
     *
     * @var null|callable(): never
     */
    public static $onTerminate = null;

    public static function json(mixed $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        self::cors();
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        self::terminate();
    }

    private static function terminate(): never
    {
        if (self::$onTerminate !== null) {
            (self::$onTerminate)();
        }

        exit;
    }

    public static function options(): never
    {
        http_response_code(204);
        self::cors();
        exit;
    }

    public static function cors(): void
    {
        $origins = array_filter(array_map('trim', explode(',', (string) Config::get('CORS_ALLOWED_ORIGINS', 'http://localhost:5173'))));
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, $origins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Credentials: true');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    }
}
