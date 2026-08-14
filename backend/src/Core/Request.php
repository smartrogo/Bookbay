<?php

declare(strict_types=1);

namespace Bookbay\Core;

/**
 * Wraps the incoming HTTP request. Also normalises the URL path so the
 * optional /api/v1 prefix can be present or absent.
 */
final class Request
{
    public static function capture(): self
    {
        return new self();
    }

    public function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    public function path(): string
    {
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

        // Strip the /api/v1 prefix when present.
        if (is_string($uri) && preg_match('#^/api/v1(/|$)#', $uri)) {
            $uri = substr($uri, strlen('/api/v1')) ?: '/';
        }

        if (!is_string($uri) || $uri === '' || $uri === '/') {
            return '/';
        }

        return '/' . ltrim($uri, '/');
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $_GET[$key] ?? $default;
    }

    public function input(): array
    {
        $raw = file_get_contents('php://input') ?: '';
        $data = json_decode($raw, true);

        if (is_array($data)) {
            return $data;
        }

        return $_POST ?: [];
    }

    public function inputField(string $key, mixed $default = null): mixed
    {
        return $this->input()[$key] ?? $default;
    }

    public function header(string $name): ?string
    {
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
        return $_SERVER[$key] ?? null;
    }

    public function bearerToken(): ?string
    {
        $auth = $this->header('Authorization');
        if ($auth && preg_match('/Bearer\s+(.+)/i', $auth, $m)) {
            return trim($m[1]);
        }
        return null;
    }

    public function cookie(string $name): ?string
    {
        return $_COOKIE[$name] ?? null;
    }
}
