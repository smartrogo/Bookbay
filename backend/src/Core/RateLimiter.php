<?php

declare(strict_types=1);

namespace Bookbay\Core;

/**
 * Sliding-window rate limiter, keyed per IP.
 *
 * Uses Redis (fixed window via INCR/EXPIRE) when the phpredis extension
 * is loaded and REDIS_HOST is configured — required for multi-process
 * deployments. Falls back to a per-process in-memory sliding window,
 * which is fine for single-process PHP (php -S, one FPM worker).
 */
final class RateLimiter
{
    /** @var array<string, array<int, int>> */
    private static array $hits = [];

    private static ?\Redis $redis = null;

    private static bool $redisAttempted = false;

    public static function check(string $bucket, int $max = 10, int $windowSeconds = 60): void
    {
        $key = 'rate:' . $bucket . ':' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown');

        $redis = self::redis();

        if ($redis !== null) {
            $count = $redis->incr($key);

            if ($count === 1) {
                $redis->expire($key, $windowSeconds);
            }

            if ($count > $max) {
                Response::json(['message' => 'Too many requests. Please try again later.'], 429);
            }

            return;
        }

        $now = time();
        self::$hits[$key] = array_values(array_filter(
            self::$hits[$key] ?? [],
            static fn (int $t): bool => $now - $t < $windowSeconds
        ));

        if (count(self::$hits[$key]) >= $max) {
            Response::json(['message' => 'Too many requests. Please try again later.'], 429);
        }

        self::$hits[$key][] = $now;
    }

    private static function redis(): ?\Redis
    {
        if (self::$redis !== null) {
            return self::$redis;
        }

        if (self::$redisAttempted) {
            return null;
        }

        self::$redisAttempted = true;

        if (!class_exists('Redis')) {
            return null;
        }

        $host = (string) Config::get('REDIS_HOST', '');

        if ($host === '') {
            return null;
        }

        try {
            $redis = new \Redis();
            $redis->connect($host, (int) Config::get('REDIS_PORT', '6379'), 0.5);

            $password = (string) Config::get('REDIS_PASSWORD', '');
            if ($password !== '') {
                $redis->auth($password);
            }

            self::$redis = $redis;
        } catch (\Throwable) {
            // Redis configured but unreachable — degrade to in-memory.
            self::$redis = null;
        }

        return self::$redis;
    }
}
