<?php

declare(strict_types=1);

namespace Bookbay\Core;

/**
 * Tiny regex router. Routes are matched in registration order, so
 * register more specific routes first (e.g. /books/user/{userId}
 * before /books/{id}).
 */
final class Router
{
    /** @var array<int, array{method: string, pattern: string, handler: callable|array}> */
    private array $routes = [];

    public function get(string $pattern, callable|array $handler): void
    {
        $this->add('GET', $pattern, $handler);
    }

    public function post(string $pattern, callable|array $handler): void
    {
        $this->add('POST', $pattern, $handler);
    }

    public function put(string $pattern, callable|array $handler): void
    {
        $this->add('PUT', $pattern, $handler);
    }

    public function patch(string $pattern, callable|array $handler): void
    {
        $this->add('PATCH', $pattern, $handler);
    }

    public function delete(string $pattern, callable|array $handler): void
    {
        $this->add('DELETE', $pattern, $handler);
    }

    public function add(string $method, string $pattern, callable|array $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'pattern' => $this->compile($pattern),
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $path): mixed
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== strtoupper($method)) {
                continue;
            }

            if (preg_match($route['pattern'], $path, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                // URL params arrive as strings; hand numeric ids to
                // controllers as ints so typed signatures work.
                $params = array_map(
                    static fn (string $v): int|string => ctype_digit($v) ? (int) $v : $v,
                    $params
                );
                return $this->call($route['handler'], $params);
            }
        }

        return null;
    }

    private function call(callable|array $handler, array $params): mixed
    {
        if (is_array($handler)) {
            [$class, $method] = $handler;
            $instance = new $class();
            return $instance->{$method}(...array_values($params));
        }

        return $handler(...array_values($params));
    }

    private function compile(string $pattern): string
    {
        $pattern = trim($pattern, '/');
        $pattern = preg_replace('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', '(?P<$1>[^/]+)', $pattern) ?? $pattern;
        return '#^/' . $pattern . '$#';
    }
}
