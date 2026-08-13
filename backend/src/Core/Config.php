<?php

declare(strict_types=1);

namespace BookBay\Core;

/**
 * Tiny environment/config loader.
 *
 * Precedence: real environment variables first, then values from the
 * .env file, then a supplied default. Setting e.g. DB_DRIVER=sqlite on
 * the CLI overrides whatever is in .env.
 */
final class Config
{
    private static array $values = [];

    public static function load(string $path): void
    {
        if (!is_file($path)) {
            return;
        }

        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
            $key = trim($key);
            $value = trim($value, " \t\"'");

            if ($key !== '') {
                self::$values[$key] = $value;
            }
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        $env = getenv($key);
        if ($env !== false && $env !== '') {
            return $env;
        }

        if (array_key_exists($key, self::$values) && self::$values[$key] !== '') {
            return self::$values[$key];
        }

        return $default;
    }
}
